package com.zonekids.springboot.api.zonekidsBackend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * DTO para crear o actualizar un producto
 * Incluye validación para 2-3 imágenes
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoRequestDto {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @Min(value = 0, message = "El precio no puede ser negativo")
    private Double precio;

    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private String categoria;

    /**
     * Lista de URLs de imágenes (mínimo 2, máximo 3)
     */
    private List<String> imagenesUrl;

    @Min(value = 0)
    private Double precioOriginal;

    private boolean esNuevo = false;

    private boolean enOferta = false;
}
