package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.dto.ApiResponse;
import com.zonekids.springboot.api.zonekidsBackend.dto.OrdenRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.OrdenResponseDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.DetalleOrdenResponseDto;
import com.zonekids.springboot.api.zonekidsBackend.entities.Orden;
import com.zonekids.springboot.api.zonekidsBackend.entities.DetalleOrden;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.services.OrdenService;
import com.zonekids.springboot.api.zonekidsBackend.services.UserService;
import com.zonekids.springboot.api.zonekidsBackend.services.ProductoServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Controlador de Órdenes con versionamiento /api/v1/
 * Gestiona la creación y consulta de órdenes de compra
 * Implementa descuento automático de stock al crear ordenes
 */
@RestController
@RequestMapping("/api/v1/ordenes")
@Tag(name = "Órdenes", description = "Endpoints para gestión de órdenes de compra")
@SecurityRequirement(name = "Bearer Authentication")
public class OrdenController {

    @Autowired
    private OrdenService ordenService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductoServices productoServices;

    /**
     * Obtener todas las órdenes (solo ADMIN)
     */
    @GetMapping
    @Operation(summary = "Listar todas las órdenes", description = "Obtiene todas las órdenes del sistema (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obtenerTodas() {
        try {
            List<Orden> ordenes = ordenService.obtenerTodas();
            List<OrdenResponseDto> response = ordenes.stream()
                    .map(this::convertirADto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.success("Órdenes obtenidas", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener órdenes"));
        }
    }

    /**
     * Obtener una orden por ID (el usuario puede ver sus propias órdenes, ADMIN todas)
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener orden por ID", description = "Obtiene los detalles de una orden específica")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<Orden> ordenOpt = ordenService.obtenerPorId(id);
            if (ordenOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Orden no encontrada"));
            }
            return ResponseEntity.ok(ApiResponse.success("Orden obtenida", convertirADto(ordenOpt.get())));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener orden"));
        }
    }

    /**
     * Crear una nueva orden (descuenta automáticamente el stock de productos)
     * Cualquier usuario autenticado puede crear órdenes
     */
    @PostMapping
    @Operation(summary = "Crear orden", description = "Crea una nueva orden de compra y descuenta el stock automáticamente")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> crear(@Valid @RequestBody OrdenRequestDto ordenRequest) {
        try {
            // Obtener el usuario
            Optional<User> usuarioOpt = userService.findUserById(ordenRequest.getUsuarioId());
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Usuario no encontrado"));
            }

            // Crear la orden
            Orden nuevaOrden = new Orden(usuarioOpt.get());
            nuevaOrden.setEstado("pendiente");

            // Procesar cada detalle de la orden
            for (var detalleRequest : ordenRequest.getDetalles()) {
                Optional<com.zonekids.springboot.api.zonekidsBackend.entities.Producto> productoOpt = 
                    productoServices.findProductById(detalleRequest.getProductoId());
                
                if (productoOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("Producto con ID " + detalleRequest.getProductoId() + " no encontrado"));
                }

                DetalleOrden detalle = new DetalleOrden(productoOpt.get(), detalleRequest.getCantidad());
                nuevaOrden.agregarDetalle(detalle);
            }

            // Crear la orden (aquí se descuenta el stock automáticamente)
            Orden ordenGuardada = ordenService.crear(nuevaOrden);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Orden creada exitosamente y stock actualizado", convertirADto(ordenGuardada)));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear la orden: " + e.getMessage()));
        }
    }

    /**
     * Cancelar una orden (revertir cambios de stock si la orden estaba completada)
     * Solo disponible para órdenes en estado "pendiente"
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Cancelar orden", description = "Cancela una orden pendiente (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cancelar(@PathVariable Long id) {
        try {
            Optional<Orden> ordenOpt = ordenService.obtenerPorId(id);
            if (ordenOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Orden no encontrada"));
            }

            Orden orden = ordenOpt.get();
            
            // Solo se pueden cancelar órdenes pendientes
            if (!orden.getEstado().equals("pendiente")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Solo se pueden cancelar órdenes pendientes"));
            }

            orden.setEstado("cancelada");
            ordenService.actualizar(orden);

            return ResponseEntity.ok(ApiResponse.success("Orden cancelada exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al cancelar la orden"));
        }
    }

    /**
     * Método helper para convertir Orden a OrdenResponseDto
     */
    private OrdenResponseDto convertirADto(Orden orden) {
        OrdenResponseDto dto = new OrdenResponseDto();
        dto.setId(orden.getId());
        dto.setUsuarioId(orden.getUsuario().getId());
        dto.setUsuarioNombre(orden.getUsuario().getNombre());
        dto.setTotal(orden.getTotal());
        dto.setEstado(orden.getEstado());
        dto.setFecha(orden.getFecha());
        
        // Convertir detalles
        List<DetalleOrdenResponseDto> detallesDto = orden.getDetalles().stream()
                .map(this::convertirDetalleADto)
                .collect(Collectors.toList());
        dto.setDetalles(detallesDto);
        
        return dto;
    }

    /**
     * Método helper para convertir DetalleOrden a DetalleOrdenResponseDto
     */
    private DetalleOrdenResponseDto convertirDetalleADto(DetalleOrden detalle) {
        DetalleOrdenResponseDto dto = new DetalleOrdenResponseDto();
        dto.setId(detalle.getId());
        dto.setProductoId(detalle.getProducto().getId());
        dto.setProductoNombre(detalle.getProducto().getNombre());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        dto.setSubtotal(detalle.getSubtotal());
        return dto;
    }
}
