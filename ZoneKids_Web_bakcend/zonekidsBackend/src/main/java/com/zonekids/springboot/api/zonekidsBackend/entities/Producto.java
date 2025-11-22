package com.zonekids.springboot.api.zonekidsBackend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @Min(value = 0)
    private Double precio; 

    @Min(value = 0)
    private Integer stock; 

    private String categoria;
    
    private String imagenUrl; 

    private String estado; 

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime fechaCreacion;
    
    @Min(value = 0)
    private Double precioOriginal; 

    private boolean esNuevo = false; 

    private boolean enOferta = false; 
}