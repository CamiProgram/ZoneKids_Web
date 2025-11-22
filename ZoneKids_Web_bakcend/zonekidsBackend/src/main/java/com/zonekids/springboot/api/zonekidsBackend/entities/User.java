package com.zonekids.springboot.api.zonekidsBackend.entities; // Cambiado a 'entities'

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "usuarios") // Nombre de la tabla en tu base de datos XAMPP
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @Email(message = "Debe ser un email válido")
    @NotBlank(message = "El email es obligatorio")
    @Column(unique = true) // No permite emails repetidos
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String contrasena; // Se acepta en entrada JSON pero no se serializa en respuestas

    @NotBlank(message = "El rol es obligatorio")
    private String rol; // Valores: "cliente", "vendedor", "super-admin"

    private String estado; // Valores: "activo", "inactivo"

    @CreationTimestamp // Fecha automática al crear
    @Column(updatable = false) // No se puede cambiar al actualizar
    private LocalDateTime fechaCreacion;
}