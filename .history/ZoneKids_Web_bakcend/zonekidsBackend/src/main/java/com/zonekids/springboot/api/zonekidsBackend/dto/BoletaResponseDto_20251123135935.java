package com.zonekids.springboot.api.zonekidsBackend.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para response de Boleta
 */
public class BoletaResponseDto {
    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private String usuarioEmail;
    private String numeroBoleta;
    private Double subtotal;
    private Double impuesto;
    private Double total;
    private String estado;
    private String metodoPago;
    private LocalDateTime fecha;
    private LocalDateTime fechaPago;
    private List<DetalleBoletaResponseDto> detalles;

    public BoletaResponseDto() {
    }

    public BoletaResponseDto(Long id, Long usuarioId, String usuarioNombre, String usuarioEmail, String numeroBoleta, Double subtotal, Double impuesto, Double total, String estado, String metodoPago, LocalDateTime fecha, LocalDateTime fechaPago, List<DetalleBoletaResponseDto> detalles) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.usuarioNombre = usuarioNombre;
        this.usuarioEmail = usuarioEmail;
        this.numeroBoleta = numeroBoleta;
        this.subtotal = subtotal;
        this.impuesto = impuesto;
        this.total = total;
        this.estado = estado;
        this.metodoPago = metodoPago;
        this.fecha = fecha;
        this.fechaPago = fechaPago;
        this.detalles = detalles;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public void setUsuarioEmail(String usuarioEmail) {
        this.usuarioEmail = usuarioEmail;
    }

    public String getNumeroBoleta() {
        return numeroBoleta;
    }

    public void setNumeroBoleta(String numeroBoleta) {
        this.numeroBoleta = numeroBoleta;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getImpuesto() {
        return impuesto;
    }

    public void setImpuesto(Double impuesto) {
        this.impuesto = impuesto;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }

    public List<DetalleBoletaResponseDto> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleBoletaResponseDto> detalles) {
        this.detalles = detalles;
    }
}
