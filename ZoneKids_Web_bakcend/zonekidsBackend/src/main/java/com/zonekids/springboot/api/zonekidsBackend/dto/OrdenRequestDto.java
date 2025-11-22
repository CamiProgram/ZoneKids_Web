package com.zonekids.springboot.api.zonekidsBackend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * DTO para crear una nueva orden
 */
@Getter
@Setter

@NoArgsConstructor
public class OrdenRequestDto {

    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

    @NotNull(message = "Debe incluir al menos un detalle")
    @Valid
    private List<DetalleOrdenRequestDto> detalles;
}


