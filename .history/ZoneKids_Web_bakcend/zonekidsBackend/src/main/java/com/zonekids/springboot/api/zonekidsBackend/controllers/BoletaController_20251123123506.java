package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.dto.ApiResponse;
import com.zonekids.springboot.api.zonekidsBackend.dto.BoletaRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.BoletaResponseDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.DetalleBoletaResponseDto;
import com.zonekids.springboot.api.zonekidsBackend.entities.Boleta;
import com.zonekids.springboot.api.zonekidsBackend.entities.DetalleBoleta;
import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.exception.BadRequestException;
import com.zonekids.springboot.api.zonekidsBackend.exception.ResourceNotFoundException;
import com.zonekids.springboot.api.zonekidsBackend.services.BoletaService;
import com.zonekids.springboot.api.zonekidsBackend.services.ProductoServices;
import com.zonekids.springboot.api.zonekidsBackend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador de Boletas con versionamiento /api/v1/
 * Proporciona endpoints para crear, consultar y gestionar boletas
 */
@RestController
@RequestMapping("/api/v1/boletas")
@Tag(name = "Boletas", description = "Endpoints para gestión de boletas de compra")
@SecurityRequirement(name = "Bearer Authentication")
public class BoletaController {

    @Autowired
    private BoletaService boletaService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductoServices productoServices;

    /**
     * Obtener todas las boletas (Solo ADMIN)
     */
    @GetMapping
    @Operation(summary = "Listar boletas", description = "Obtiene todas las boletas del sistema (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obtenerTodas() {
        List<Boleta> boletas = boletaService.findAll();
        List<BoletaResponseDto> response = boletas.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Boletas obtenidas", response));
    }

    /**
     * Obtener boleta por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener boleta por ID", description = "Obtiene los detalles de una boleta específica")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        Boleta boleta = boletaService.findBoletaById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta con ID " + id + " no encontrada"));
        return ResponseEntity.ok(ApiResponse.success("Boleta obtenida", convertirADto(boleta)));
    }

    /**
     * Obtener boletas del usuario autenticado
     */
    @GetMapping("/usuario/mis-boletas")
    @Operation(summary = "Obtener mis boletas", description = "Obtiene todas las boletas del usuario autenticado")
    public ResponseEntity<?> obtenerMisBoletas(@RequestParam Long usuarioId) {
        User usuario = userService.findUserById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con ID " + usuarioId + " no encontrado"));

        List<Boleta> boletas = boletaService.findBoletasByUsuario(usuario);
        List<BoletaResponseDto> response = boletas.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Boletas obtenidas", response));
    }

    /**
     * Crear una nueva boleta (transaccional para garantizar atomicidad)
     */
    @PostMapping
    @Operation(summary = "Crear boleta", description = "Crea una nueva boleta de compra")
    @Transactional
    public ResponseEntity<?> crear(@RequestBody BoletaRequestDto boletaRequest) {
        // Validar usuario
        User usuario = userService.findUserById(boletaRequest.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Validar detalles
        if (boletaRequest.getDetalles() == null || boletaRequest.getDetalles().isEmpty()) {
            throw new BadRequestException("La boleta debe tener al menos un producto");
        }

        // Crear boleta
        Boleta boleta = new Boleta();
        boleta.setUsuario(usuario);
        boleta.setNumeroBoleta(boletaService.generarNumeroBoleta());
        boleta.setEstado("pendiente");
        boleta.setMetodoPago(boletaRequest.getMetodoPago() != null ? boletaRequest.getMetodoPago() : "pendiente");

        // Agregar detalles y validar stock
        for (var detalleRequest : boletaRequest.getDetalles()) {
            Producto producto = productoServices.findProductById(detalleRequest.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto con ID " + detalleRequest.getProductoId() + " no encontrado"));

            // Validar stock
            if (producto.getStock() < detalleRequest.getCantidad()) {
                throw new BadRequestException("Stock insuficiente para el producto " + producto.getNombre() + 
                        ". Disponible: " + producto.getStock() + ", solicitado: " + detalleRequest.getCantidad());
            }

            // Crear detalle de boleta
            DetalleBoleta detalle = new DetalleBoleta(producto, detalleRequest.getCantidad());
            boleta.agregarDetalle(detalle);

            // Descontar stock
            producto.setStock(producto.getStock() - detalleRequest.getCantidad());
            productoServices.saveProduct(producto);
        }

        // Guardar boleta
        Boleta savedBoleta = boletaService.saveBoleta(boleta);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Boleta creada exitosamente", convertirADto(savedBoleta)));
    }

    /**
     * Marcar boleta como pagada
     */
    @PatchMapping("/{id}/pagar")
    @Operation(summary = "Pagar boleta", description = "Marca una boleta como pagada")
    public ResponseEntity<?> pagarBoleta(@PathVariable Long id, @RequestParam String metodoPago) {
        Boleta boleta = boletaService.findBoletaById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta con ID " + id + " no encontrada"));

        if (!boleta.getEstado().equals("pendiente")) {
            throw new BadRequestException("No se puede pagar una boleta en estado " + boleta.getEstado());
        }

        boleta.setEstado("pagada");
        boleta.setMetodoPago(metodoPago);
        boleta.setFechaPago(LocalDateTime.now());

        Boleta updatedBoleta = boletaService.saveBoleta(boleta);
        return ResponseEntity.ok(ApiResponse.success("Boleta pagada exitosamente", convertirADto(updatedBoleta)));
    }

    /**
     * Cancelar boleta
     */
    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar boleta", description = "Cancela una boleta y devuelve el stock")
    @Transactional
    public ResponseEntity<?> cancelarBoleta(@PathVariable Long id) {
        Boleta boleta = boletaService.findBoletaById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta con ID " + id + " no encontrada"));

        if (boleta.getEstado().equals("cancelada")) {
            throw new BadRequestException("La boleta ya está cancelada");
        }

        // Devolver stock
        for (DetalleBoleta detalle : boleta.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStock(producto.getStock() + detalle.getCantidad());
            productoServices.saveProduct(producto);
        }

        boleta.setEstado("cancelada");
        Boleta updatedBoleta = boletaService.saveBoleta(boleta);
        return ResponseEntity.ok(ApiResponse.success("Boleta cancelada exitosamente y stock devuelto", convertirADto(updatedBoleta)));
    }

    /**
     * Eliminar boleta (Solo ADMIN)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar boleta", description = "Elimina una boleta del sistema (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        Boleta boleta = boletaService.findBoletaById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Boleta con ID " + id + " no encontrada"));

        boletaService.deleteBoletaById(id);
        return ResponseEntity.ok(ApiResponse.success("Boleta eliminada exitosamente", null));
    }

    /**
     * Método helper para convertir Boleta a BoletaResponseDto
     */
    private BoletaResponseDto convertirADto(Boleta boleta) {
        BoletaResponseDto dto = new BoletaResponseDto();
        dto.setId(boleta.getId());
        dto.setUsuarioId(boleta.getUsuario().getId());
        dto.setUsuarioNombre(boleta.getUsuario().getNombre());
        dto.setUsuarioEmail(boleta.getUsuario().getEmail());
        dto.setNumeroBoleta(boleta.getNumeroBoleta());
        dto.setSubtotal(boleta.getSubtotalDouble());
        dto.setImpuesto(boleta.getImpuestoDouble());
        dto.setTotal(boleta.getTotalDouble());
        dto.setEstado(boleta.getEstado());
        dto.setMetodoPago(boleta.getMetodoPago());
        dto.setFecha(boleta.getFecha());
        dto.setFechaPago(boleta.getFechaPago());
        dto.setDetalles(boleta.getDetalles().stream()
                .map(this::convertirDetalleADto)
                .collect(Collectors.toList()));
        return dto;
    }

    /**
     * Método helper para convertir DetalleBoleta a DetalleBoletaResponseDto
     */
    private DetalleBoletaResponseDto convertirDetalleADto(DetalleBoleta detalle) {
        DetalleBoletaResponseDto dto = new DetalleBoletaResponseDto();
        dto.setId(detalle.getId());
        dto.setProductoId(detalle.getProducto().getId());
        dto.setProductoNombre(detalle.getProducto().getNombre());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPrecioUnitarioDouble());
        dto.setSubtotal(detalle.getSubtotalDouble());
        return dto;
    }

    /**
     * Método findAll en BoletaService - se agrega si no existe
     */
}
