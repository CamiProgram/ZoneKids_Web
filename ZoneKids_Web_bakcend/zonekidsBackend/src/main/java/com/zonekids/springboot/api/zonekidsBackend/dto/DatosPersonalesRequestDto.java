package com.zonekids.springboot.api.zonekidsBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO para request de DatosPersonales
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DatosPersonalesRequestDto {
    private String nombreCompleto;
    private String apellido;
    private String telefono;
    private String direccion;
    private String ciudad;
    private String pais;
    private String codigoPostal;
    private String rut;
}
