package com.zonekids.springboot.api.zonekidsBackend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/**
 * Entidad que representa los datos personales de un usuario
 * Separado de User para evitar duplicación y mejorar la estructura
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "datos_personales")
public class DatosPersonales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private User usuario;

    @NotBlank(message = "El nombre completo es obligatorio")
    @Column(nullable = false)
    private String nombreCompleto;

    @NotBlank(message = "El apellido es obligatorio")
    @Column(nullable = false)
    private String apellido;

    @Column
    private String telefono;

    @Column
    private String direccion;

    @Column
    private String ciudad;

    @Column
    private String pais;

    @Column
    private String codigoPostal;

    @Column
    private String rut; // Identificación única (RUT para Chile)

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(nullable = true)
    private LocalDateTime fechaActualizacion;

    // Getters y Setters generados por Lombok
}
