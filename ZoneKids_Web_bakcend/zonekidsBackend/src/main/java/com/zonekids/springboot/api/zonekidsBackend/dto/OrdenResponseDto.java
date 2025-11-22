package com.zonekids.springboot.api.zonekidsBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para la respuesta de orden
 */
@Getter
@Setter

@NoArgsConstructor
public class OrdenResponseDto {
    private Long id;
    private String usuarioNombre;
    private String usuarioEmail;
    private Double total;
    private String estado;
    private LocalDateTime fecha;
    private List<DetalleOrdenResponseDto> detalles;

    // Getters y Setters - Generados por Lombok pero agregados explícitamente
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }
    public String getUsuarioEmail() { return usuarioEmail; }
    public void setUsuarioEmail(String usuarioEmail) { this.usuarioEmail = usuarioEmail; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public List<DetalleOrdenResponseDto> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleOrdenResponseDto> detalles) { this.detalles = detalles; }
}


