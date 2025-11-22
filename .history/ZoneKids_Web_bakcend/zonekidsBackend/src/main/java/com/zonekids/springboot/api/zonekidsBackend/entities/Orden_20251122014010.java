package com.zonekids.springboot.api.zonekidsBackend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa una orden de compra
 */
@Data
@Entity
@Table(name = "ordenes")
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El usuario es obligatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @Column(nullable = false)
    private Double total = 0.0;

    @Column(nullable = false)
    private String estado; // "pendiente", "completada", "cancelada"

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime fecha;

    /**
     * Relación One-to-Many con DetalleOrden
     * cascade = ALL: al eliminar la orden, se eliminan los detalles
     * orphanRemoval = true: si se quita un detalle de la lista, se elimina de la BD
     */
    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<DetalleOrden> detalles = new ArrayList<>();

    // Constructor vacío (requerido por Hibernate)
    public Orden() {
    }

    // Constructor con parámetros principales
    public Orden(User usuario) {
        this.usuario = usuario;
        this.estado = "pendiente";
        this.total = 0.0;
    }

    /**
     * Agrega un detalle a la orden y actualiza el total
     */
    public void agregarDetalle(DetalleOrden detalle) {
        if (detalles == null) {
            detalles = new ArrayList<>();
        }
        detalle.setOrden(this);
        detalles.add(detalle);
        actualizarTotal();
    }

    /**
     * Calcula el total de la orden sumando los detalles
     */
    public void actualizarTotal() {
        this.total = detalles.stream()
                .mapToDouble(d -> d.getSubtotal())
                .sum();
    }
}
