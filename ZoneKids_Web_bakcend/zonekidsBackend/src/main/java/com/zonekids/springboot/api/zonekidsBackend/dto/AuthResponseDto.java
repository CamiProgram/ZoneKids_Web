package com.zonekids.springboot.api.zonekidsBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class AuthResponseDto {

    private String token;
    private String mensaje;

    // Getters y Setters - Generados por Lombok pero agregados explícitamente
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}


