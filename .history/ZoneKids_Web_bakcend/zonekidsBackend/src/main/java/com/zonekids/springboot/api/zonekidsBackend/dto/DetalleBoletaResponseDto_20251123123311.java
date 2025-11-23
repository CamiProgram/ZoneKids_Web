package com.zonekids.springboot.api.zonekidsBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para response de DetalleBoletaResponseDto
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleBoletaResponseDto {
    private Long id;
    private Long productoId;
    private String productoNombre;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
}
