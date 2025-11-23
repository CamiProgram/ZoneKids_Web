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

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}


