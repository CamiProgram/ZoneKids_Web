package com.zonekids.springboot.api.zonekidsBackend.dto;

import com.zonekids.springboot.api.zonekidsBackend.enums.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO para la respuesta de datos del usuario
 * No incluye la contraseña por seguridad
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioResponseDto {
    private Long id;
    private String nombre;
    private String email;
    private RoleEnum rol;
    private String estado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
