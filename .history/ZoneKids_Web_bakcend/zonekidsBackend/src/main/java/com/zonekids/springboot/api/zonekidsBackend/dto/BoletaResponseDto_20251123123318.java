package com.zonekids.springboot.api.zonekidsBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para response de Boleta
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BoletaResponseDto {
    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private String usuarioEmail;
    private String numeroBoleta;
    private Double subtotal;
    private Double impuesto;
    private Double total;
    private String estado;
    private String metodoPago;
    private LocalDateTime fecha;
    private LocalDateTime fechaPago;
    private List<DetalleBoletaResponseDto> detalles;
}
