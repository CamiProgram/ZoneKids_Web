package com.zonekids.springboot.api.zonekidsBackend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa una boleta de compra
 * Similar a Orden pero con más información de boleta
 */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "boletas")
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El usuario es obligatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @Column(nullable = false, unique = true)
    private String numeroBoleta; // Formato: BOL-2025-0001

    @Column(nullable = false)
    private Long subtotal = 0L; // Subtotal sin impuestos (número entero)

    @Column(nullable = false)
    private Long impuesto = 0L; // IVA u otro impuesto (número entero)

    @Column(nullable = false)
    private Long total = 0L; // Total con impuesto (número entero)

    @Column(nullable = false)
    private String estado; // "pendiente", "pagada", "cancelada"

    @Column
    private String metodoPago; // "efectivo", "tarjeta", "transferencia", etc.

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime fecha;

    @Column
    private LocalDateTime fechaPago;

    /**
     * Relación One-to-Many con DetalleBoleta
     * cascade = ALL: al eliminar la boleta, se eliminan los detalles
     * orphanRemoval = true: si se quita un detalle de la lista, se elimina de la BD
     */
    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<DetalleBoleta> detalles = new ArrayList<>();

    /**
     * Constructor con parámetros principales
     */
    public Boleta(User usuario, String numeroBoleta) {
        this.usuario = usuario;
        this.numeroBoleta = numeroBoleta;
        this.estado = "pendiente";
        this.subtotal = 0L;
        this.impuesto = 0L;
        this.total = 0L;
    }

    /**
     * Agrega un detalle a la boleta y actualiza el total
     */
    public void agregarDetalle(DetalleBoleta detalle) {
        if (detalles == null) {
            detalles = new ArrayList<>();
        }
        detalle.setBoleta(this);
        detalles.add(detalle);
        actualizarTotal();
    }

    /**
     * Calcula el total de la boleta sumando los detalles
     * Resta 19% de IVA del subtotal
     */
    public void actualizarTotal() {
        this.subtotal = detalles.stream()
                .mapToLong(d -> d.getSubtotal())
                .sum();
        // Calcular IVA (19%)
        this.impuesto = (this.subtotal * 19) / 100;
        this.total = this.subtotal + this.impuesto;
    }

    /**
     * Para compatibilidad con API que retorna Double
     */
    public Double getSubtotalDouble() {
        return subtotal == null ? null : subtotal.doubleValue();
    }

    public Double getImpuestoDouble() {
        return impuesto == null ? null : impuesto.doubleValue();
    }

    public Double getTotalDouble() {
        return total == null ? null : total.doubleValue();
    }
}
