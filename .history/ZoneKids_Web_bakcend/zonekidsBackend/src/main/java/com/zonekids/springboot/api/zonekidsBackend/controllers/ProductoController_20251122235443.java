package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.dto.ApiResponse;
import com.zonekids.springboot.api.zonekidsBackend.dto.ProductoRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.ProductoResponseDto;
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
            // Validar que tenga entre 2 y 3 imágenes
            if (productoRequest.getImagenesUrl() == null || 
                productoRequest.getImagenesUrl().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El producto debe tener mínimo 2 imágenes");
            }

            if (productoRequest.getImagenesUrl().size() < 2 || 
                productoRequest.getImagenesUrl().size() > 3) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El producto debe tener entre 2 y 3 imágenes");
            }

            // Crear el producto
            Producto producto = new Producto();
            producto.setNombre(productoRequest.getNombre());
            producto.setDescripcion(productoRequest.getDescripcion());
            producto.setPrecio(productoRequest.getPrecio());
            producto.setStock(productoRequest.getStock());
            producto.setCategoria(productoRequest.getCategoria());
            producto.setImagenesUrl(productoRequest.getImagenesUrl());
            producto.setEstado("activo");
            producto.setPrecioOriginal(productoRequest.getPrecioOriginal());
            producto.setEsNuevo(productoRequest.isEsNuevo());
            producto.setEnOferta(productoRequest.isEnOferta());

            Producto savedProducto = productoServices.saveProduct(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertirADto(savedProducto));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el producto: " + e.getMessage());
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
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado");
            }

            // Validar imágenes
            if (productoRequest.getImagenesUrl() == null || 
                productoRequest.getImagenesUrl().size() < 2 || 
                productoRequest.getImagenesUrl().size() > 3) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El producto debe tener entre 2 y 3 imágenes");
            }

            Producto producto = productoOpt.get();
            producto.setNombre(productoRequest.getNombre());
            producto.setDescripcion(productoRequest.getDescripcion());
            producto.setPrecio(productoRequest.getPrecio());
            producto.setStock(productoRequest.getStock());
            producto.setCategoria(productoRequest.getCategoria());
            producto.setImagenesUrl(productoRequest.getImagenesUrl());
            producto.setPrecioOriginal(productoRequest.getPrecioOriginal());
            producto.setEsNuevo(productoRequest.isEsNuevo());
            producto.setEnOferta(productoRequest.isEnOferta());

            Producto updatedProducto = productoServices.saveProduct(producto);
            return ResponseEntity.ok(convertirADto(updatedProducto));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el producto: " + e.getMessage());
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
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado");
            }
            productoServices.deleteProductById(id);
            return ResponseEntity.ok("Producto eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el producto: " + e.getMessage());
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