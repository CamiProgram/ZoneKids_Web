package com.zonekids.springboot.api.zonekidsBackend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidad que representa un detalle (item) dentro de una orden
 * Relación Many-to-One con Orden
 */
@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "detalle_ordenes")
public class DetalleOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La orden es obligatoria")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "orden_id", nullable = false)
    private Orden orden;

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

    // Constructor vacío (requerido por Hibernate) - Generado por Lombok @NoArgsConstructor

    // Constructor con parámetros principales
    public DetalleOrden(Producto producto, Integer cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
        Double precioProducto = producto.getPrecio();
        this.precioUnitario = precioProducto == null ? 0L : precioProducto.longValue();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Orden getOrden() {
        return orden;
    }

    public void setOrden(Orden orden) {
        this.orden = orden;
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

    public Double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(Double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
}

