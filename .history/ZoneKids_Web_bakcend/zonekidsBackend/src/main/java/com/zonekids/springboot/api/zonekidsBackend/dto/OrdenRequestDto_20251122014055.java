package com.zonekids.springboot.api.zonekidsBackend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * DTO para crear una nueva orden
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrdenRequestDto {

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

    @NotNull(message = "Debe incluir al menos un detalle")
    @Valid
    private List<DetalleOrdenRequestDto> detalles;
}
