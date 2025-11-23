package com.zonekids.springboot.api.zonekidsBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * DTO para request de Boleta
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BoletaRequestDto {
    private Long usuarioId;
    private String metodoPago;
    private List<DetalleBoletaRequestDto> detalles;
}
