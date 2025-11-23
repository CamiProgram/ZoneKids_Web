package com.zonekids.springboot.api.zonekidsBackend.dto;

import java.util.List;

/**
 * DTO para request de Boleta
 */
public class BoletaRequestDto {
    private Long usuarioId;
    private String metodoPago;
    private List<DetalleBoletaRequestDto> detalles;

    public BoletaRequestDto() {
    }

    public BoletaRequestDto(Long usuarioId, String metodoPago, List<DetalleBoletaRequestDto> detalles) {
        this.usuarioId = usuarioId;
        this.metodoPago = metodoPago;
        this.detalles = detalles;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public List<DetalleBoletaRequestDto> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleBoletaRequestDto> detalles) {
        this.detalles = detalles;
    }
}
