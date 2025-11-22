package com.zonekids.springboot.api.zonekidsBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para la respuesta de detalle de orden
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetalleOrdenResponseDto {
    private Long id;
    private String productoNombre;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
}
