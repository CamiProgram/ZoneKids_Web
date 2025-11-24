package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.dto.ApiResponse;
import com.zonekids.springboot.api.zonekidsBackend.dto.ProductoRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.ProductoResponseDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.ActualizarImagenesRequest;
import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
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
 * Controlador de Productos con versionamiento /api/v1/
 * Implementa control de acceso basado en roles:
 * - ADMIN: CRUD completo
 * - VENDEDOR: Solo lectura (GET)
 * - CLIENTE: Solo lectura (GET)
 */
@RestController
@RequestMapping("/api/v1/productos")
@Tag(name = "Productos", description = "Endpoints para gestión de productos")
@SecurityRequirement(name = "Bearer Authentication")
public class ProductoController {

    @Autowired
    private ProductoServices productoServices;

    /**
     * Obtener todos los productos (lectura pública - sin autenticación)
     */
    @GetMapping
    @Operation(summary = "Listar productos", description = "Obtiene todos los productos disponibles (público)")
    public ResponseEntity<?> obtenerTodos() {
        try {
            List<Producto> productos = productoServices.findAllProducts();
            List<ProductoResponseDto> response = productos.stream()
                    .map(this::convertirADto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.success("Productos obtenidos", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener productos"));
        }
    }

    /**
     * Obtener un producto por ID (lectura pública - sin autenticación)
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID", description = "Obtiene los detalles de un producto específico (público)")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<Producto> producto = productoServices.findProductById(id);
            if (producto.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Producto obtenido", convertirADto(producto.get())));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Producto no encontrado"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener producto"));
        }
    }

    /**
     * Crear un nuevo producto (solo ADMIN)
     * Validación: 2-3 imágenes obligatorias
     */
    @PostMapping
    @Operation(summary = "Crear producto", description = "Crea un nuevo producto (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crear(@Valid @RequestBody ProductoRequestDto productoRequest) {
        try {
            // Crear el producto
            Producto producto = new Producto();
            producto.setNombre(productoRequest.getNombre());
            producto.setDescripcion(productoRequest.getDescripcion());
            Long precio = productoRequest.getPrecio();
            producto.setPrecio(precio == null ? null : precio.doubleValue());
            producto.setStock(productoRequest.getStock());
            producto.setCategoria(productoRequest.getCategoria());
            producto.setImagenesUrl(productoRequest.getImagenesUrl());
            producto.setEstado("activo");
            Long precioOriginal = productoRequest.getPrecioOriginal();
            producto.setPrecioOriginal(precioOriginal == null ? null : precioOriginal.doubleValue());
            producto.setEsNuevo(productoRequest.isEsNuevo());
            producto.setEnOferta(productoRequest.isEnOferta());

            Producto savedProducto = productoServices.saveProduct(producto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Producto creado exitosamente", convertirADto(savedProducto)));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear el producto"));
        }
    }

    /**
     * Actualizar un producto (solo ADMIN)
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto", description = "Actualiza un producto existente (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody ProductoRequestDto productoRequest) {
        try {
            Optional<Producto> productoOpt = productoServices.findProductById(id);
            if (productoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Producto no encontrado"));
            }

            Producto producto = productoOpt.get();
            producto.setNombre(productoRequest.getNombre());
            producto.setDescripcion(productoRequest.getDescripcion());
            Long precio = productoRequest.getPrecio();
            producto.setPrecio(precio == null ? null : precio.doubleValue());
            producto.setStock(productoRequest.getStock());
            producto.setCategoria(productoRequest.getCategoria());
            producto.setImagenesUrl(productoRequest.getImagenesUrl());
            Long precioOriginal = productoRequest.getPrecioOriginal();
            producto.setPrecioOriginal(precioOriginal == null ? null : precioOriginal.doubleValue());
            producto.setEsNuevo(productoRequest.isEsNuevo());
            producto.setEnOferta(productoRequest.isEnOferta());

            Producto updatedProducto = productoServices.saveProduct(producto);
            return ResponseEntity.ok(ApiResponse.success("Producto actualizado exitosamente", convertirADto(updatedProducto)));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar el producto"));
        }
    }

    /**
     * Actualizar imágenes de un producto (solo ADMIN)
     * PATCH para cambiar solo las imágenes sin modificar otros campos
     */
    @PatchMapping("/{id}/imagenes")
    @Operation(summary = "Actualizar imágenes del producto", description = "Actualiza las 2-3 imágenes de un producto (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarImagenes(@PathVariable Long id, @RequestBody ActualizarImagenesRequest request) {
        try {
            Optional<Producto> productoOpt = productoServices.findProductById(id);
            if (productoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Producto no encontrado"));
            }

            // Validar que tenga entre 2 y 3 imágenes
            if (request.getImagenesUrl() == null || request.getImagenesUrl().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Debe proporcionar entre 2 y 3 imágenes"));
            }

            if (request.getImagenesUrl().size() < 2) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Mínimo 2 imágenes requeridas"));
            }

            if (request.getImagenesUrl().size() > 3) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Máximo 3 imágenes permitidas"));
            }

            Producto producto = productoOpt.get();
            producto.setImagenesUrl(request.getImagenesUrl());

            Producto updatedProducto = productoServices.saveProduct(producto);
            
            return ResponseEntity.ok(ApiResponse.success("Imágenes actualizadas exitosamente", convertirADto(updatedProducto)));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar las imágenes: " + e.getMessage()));
        }
    }

    /**
     * Deshabilitar/habilitar un producto (solo ADMIN)
     * PATCH para cambiar el estado sin modificar otros campos
     */
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado del producto", description = "Deshabilita o habilita un producto (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody EstadoProductoRequest request) {
        try {
            Optional<Producto> productoOpt = productoServices.findProductById(id);
            if (productoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Producto no encontrado"));
            }

            String nuevoEstado = request.getEstado().toLowerCase();
            if (!nuevoEstado.equals("activo") && !nuevoEstado.equals("inactivo")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("El estado debe ser 'activo' o 'inactivo'"));
            }

            Producto producto = productoOpt.get();
            String estadoAnterior = producto.getEstado();
            producto.setEstado(nuevoEstado);

            Producto updatedProducto = productoServices.saveProduct(producto);
            
            String mensaje = nuevoEstado.equals("activo") 
                ? "Producto habilitado exitosamente" 
                : "Producto deshabilitado exitosamente";
            
            return ResponseEntity.ok(ApiResponse.success(mensaje, convertirADto(updatedProducto)));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al cambiar el estado del producto"));
        }
    }

    /**
     * Eliminar un producto (solo ADMIN)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar producto", description = "Elimina un producto (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            if (!productoServices.findProductById(id).isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Producto no encontrado"));
            }
            productoServices.deleteProductById(id);
            return ResponseEntity.ok(ApiResponse.success("Producto eliminado exitosamente", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar el producto"));
        }
    }

    /**
     * Clase interna para recibir el estado en la solicitud
     */
    public static class EstadoProductoRequest {
        private String estado;

        public String getEstado() {
            return estado;
        }

        public void setEstado(String estado) {
            this.estado = estado;
        }
    }

    /**
     * Método helper para convertir Producto a ProductoResponseDto
     */
    private ProductoResponseDto convertirADto(Producto producto) {
        ProductoResponseDto dto = new ProductoResponseDto();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecio(producto.getPrecio());
        dto.setStock(producto.getStock());
        dto.setCategoria(producto.getCategoria());
        dto.setImagenesUrl(producto.getImagenesUrl());
        dto.setEstado(producto.getEstado());
        dto.setFechaCreacion(producto.getFechaCreacion());
        dto.setFechaActualizacion(producto.getFechaActualizacion());
        dto.setPrecioOriginal(producto.getPrecioOriginal());
        dto.setEsNuevo(producto.isEsNuevo());
        dto.setEnOferta(producto.isEnOferta());
        return dto;
    }
}