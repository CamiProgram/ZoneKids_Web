package com.zonekids.springboot.api.zonekidsBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para request de DetalleBolet a
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleBoletaRequestDto {
    private Long productoId;
    private Integer cantidad;
}
