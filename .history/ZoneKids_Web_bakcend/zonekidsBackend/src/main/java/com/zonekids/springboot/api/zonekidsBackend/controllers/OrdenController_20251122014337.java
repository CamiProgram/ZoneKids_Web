package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.dto.OrdenRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.OrdenResponseDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.DetalleOrdenResponseDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.DetalleOrdenRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.entities.Orden;
import com.zonekids.springboot.api.zonekidsBackend.entities.DetalleOrden;
import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.services.OrdenService;
import com.zonekids.springboot.api.zonekidsBackend.services.ProductoServices;
import com.zonekids.springboot.api.zonekidsBackend.services.UserService;
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
 * Control de acceso por rol:
 * - ADMIN: CRUD completo, acceso a todas las órdenes
 * - VENDEDOR: Solo lectura (GET)
 * - CLIENTE: Puede crear órdenes propias y ver sus órdenes
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
     * Obtener todas las órdenes
     * ADMIN: acceso total
     * VENDEDOR: solo lectura
     */
    @GetMapping
    @Operation(summary = "Listar órdenes", description = "Obtiene todas las órdenes del sistema")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<List<OrdenResponseDto>> obtenerTodas() {
        List<Orden> ordenes = ordenService.obtenerTodas();
        List<OrdenResponseDto> response = ordenes.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener una orden por ID
     * ADMIN: acceso total
     * VENDEDOR: solo lectura
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener orden por ID", description = "Obtiene los detalles de una orden específica")
    @PreAuthorize("hasAnyRole('ADMIN', 'VENDEDOR')")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        Optional<Orden> orden = ordenService.obtenerPorId(id);
        if (orden.isPresent()) {
            return ResponseEntity.ok(convertirADto(orden.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Orden no encontrada");
    }

    /**
     * Crear una nueva orden
     * ADMIN: puede crear órdenes para cualquier usuario
     * CLIENTE: puede crear órdenes para sí mismo
     */
    @PostMapping
    @Operation(summary = "Crear orden", description = "Crea una nueva orden de compra")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<?> crear(@Valid @RequestBody OrdenRequestDto ordenRequest) {
        try {
            // Obtener el usuario
            Optional<User> usuarioOpt = userService.findUserById(ordenRequest.getUsuarioId());
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }

            // Validar que haya detalles
            if (ordenRequest.getDetalles() == null || ordenRequest.getDetalles().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("La orden debe incluir al menos un producto");
            }

            // Crear la orden
            Orden orden = new Orden(usuarioOpt.get());

            // Procesar cada detalle
            for (DetalleOrdenRequestDto detalleRequest : ordenRequest.getDetalles()) {
                Optional<Producto> productoOpt = productoServices.findProductById(detalleRequest.getProductoId());
                if (productoOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Producto no encontrado: " + detalleRequest.getProductoId());
                }

                Producto producto = productoOpt.get();

                // Validar stock
                if (producto.getStock() < detalleRequest.getCantidad()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Stock insuficiente para: " + producto.getNombre());
                }

                // Crear el detalle
                DetalleOrden detalle = new DetalleOrden(producto, detalleRequest.getCantidad());
                orden.agregarDetalle(detalle);

                // Actualizar stock del producto
                producto.setStock(producto.getStock() - detalleRequest.getCantidad());
                productoServices.saveProduct(producto);
            }

            orden.setEstado("pendiente");
            Orden savedOrden = ordenService.crear(orden);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertirADto(savedOrden));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la orden: " + e.getMessage());
        }
    }

    /**
     * Actualizar el estado de una orden (solo ADMIN)
     */
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado de orden", description = "Actualiza el estado de una orden (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam String estado) {
        try {
            Optional<Orden> ordenOpt = ordenService.obtenerPorId(id);
            if (ordenOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Orden no encontrada");
            }

            String[] estadosValidos = {"pendiente", "completada", "cancelada"};
            boolean esValido = false;
            for (String e : estadosValidos) {
                if (e.equals(estado)) {
                    esValido = true;
                    break;
                }
            }

            if (!esValido) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Estado inválido. Valores válidos: pendiente, completada, cancelada");
            }

            Orden orden = ordenOpt.get();
            orden.setEstado(estado);
            Orden updatedOrden = ordenService.actualizar(orden);
            return ResponseEntity.ok(convertirADto(updatedOrden));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cambiar el estado: " + e.getMessage());
        }
    }

    /**
     * Eliminar una orden (solo ADMIN)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar orden", description = "Elimina una orden (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            if (!ordenService.obtenerPorId(id).isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Orden no encontrada");
            }
            ordenService.eliminar(id);
            return ResponseEntity.ok("Orden eliminada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la orden: " + e.getMessage());
        }
    }

    /**
     * Método helper para convertir Orden a OrdenResponseDto
     */
    private OrdenResponseDto convertirADto(Orden orden) {
        List<DetalleOrdenResponseDto> detalles = orden.getDetalles().stream()
                .map(d -> new DetalleOrdenResponseDto(
                        d.getId(),
                        d.getProducto().getNombre(),
                        d.getCantidad(),
                        d.getPrecioUnitario(),
                        d.getSubtotal()
                ))
                .collect(Collectors.toList());

        return new OrdenResponseDto(
                orden.getId(),
                orden.getUsuario().getNombre(),
                orden.getUsuario().getEmail(),
                orden.getTotal(),
                orden.getEstado(),
                orden.getFecha(),
                detalles
        );
    }
}
