package com.zonekids.springboot.api.zonekidsBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para la respuesta de orden
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrdenResponseDto {
    private Long id;
    private String usuarioNombre;
    private String usuarioEmail;
    private Double total;
    private String estado;
    private LocalDateTime fecha;
    private List<DetalleOrdenResponseDto> detalles;
}
