package com.zonekids.springboot.api.zonekidsBackend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad que representa un detalle (item) dentro de una boleta
 * Relación Many-to-One con Boleta
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "detalle_boletas")
public class DetalleBoleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La boleta es obligatoria")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "boleta_id", nullable = false)
    private Boleta boleta;

    @NotNull(message = "El producto es obligatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Long precioUnitario; // Precio del producto al momento de la compra (número entero)

    /**
     * Subtotal del detalle (cantidad * precioUnitario)
     */
    @Transient
    public Long getSubtotal() {
        return cantidad * precioUnitario;
    }

    /**
     * Constructor con parámetros principales
     */
    public DetalleBoleta(Producto producto, Integer cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
        Double precioProducto = producto.getPrecio();
        this.precioUnitario = precioProducto == null ? 0L : precioProducto.longValue();
    }

    /**
     * Getters y Setters con conversión Double/Long
     */
    public Double getPrecioUnitarioDouble() {
        return precioUnitario == null ? null : precioUnitario.doubleValue();
    }

    public void setPrecioUnitarioDouble(Double precioUnitario) {
        this.precioUnitario = precioUnitario == null ? null : precioUnitario.longValue();
    }

    public Long getSubtotalLong() {
        return this.getSubtotal();
    }

    public Double getSubtotalDouble() {
        Long sub = this.getSubtotal();
        return sub == null ? null : sub.doubleValue();
    }

    // Getters y Setters explícitos (Lombok @Getter @Setter)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boleta getBoleta() {
        return boleta;
    }

    public void setBoleta(Boleta boleta) {
        this.boleta = boleta;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Long getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Long precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
}
