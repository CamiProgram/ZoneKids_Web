package com.zonekids.springboot.api.zonekidsBackend.dto;

/**
 * DTO para request de DetalleBolet a
 */
public class DetalleBoletaRequestDto {
    private Long productoId;
    private Integer cantidad;

    public DetalleBoletaRequestDto() {
    }

    public DetalleBoletaRequestDto(Long productoId, Integer cantidad) {
        this.productoId = productoId;
        this.cantidad = cantidad;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}
