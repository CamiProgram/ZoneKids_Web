package com.zonekids.springboot.api.zonekidsBackend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear un detalle de orden (item)
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetalleOrdenRequestDto {

    @NotNull(message = "El ID del producto es obligatorio")
    private Long productoId;

    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;
}
