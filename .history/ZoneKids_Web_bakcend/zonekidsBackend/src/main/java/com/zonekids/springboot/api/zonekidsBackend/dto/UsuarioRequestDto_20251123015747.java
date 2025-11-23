package com.zonekids.springboot.api.zonekidsBackend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

/**
 * DTO para crear o actualizar un usuario
 */
@Getter
@Setter
@NoArgsConstructor
public class UsuarioRequestDto {
    
    private String nombre;
    private String email;
    private String contrasena;
    private String rol;
}


