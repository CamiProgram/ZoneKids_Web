package com.zonekids.springboot.api.zonekidsBackend.entities; // Cambiado a 'entities'

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.zonekids.springboot.api.zonekidsBackend.enums.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios") // Nombre de la tabla en tu base de datos XAMPP
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @Email(message = "Debe ser un email válido")
    @NotBlank(message = "El email es obligatorio")
    @Column(unique = true, nullable = false) // No permite emails repetidos
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String contrasena; // Se acepta en entrada JSON pero no se serializa en respuestas

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleEnum rol; // Valores: ADMIN, VENDEDOR, CLIENTE

    @Column(nullable = false)
    private String estado; // Valores: "activo", "inactivo" (default: "activo")

    @CreationTimestamp // Fecha automática al crear
    @Column(updatable = false, nullable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp // Fecha automática al actualizar
    @Column(nullable = false)
    private LocalDateTime fechaActualizacion;

    // Getters y Setters generados por Lombok (@Getter, @Setter)
    // No necesitamos agregarlos manualmente

    /**
     * Método helper para obtener el rol como String
     */
    public String getRolString() {
        return this.rol != null ? this.rol.getValor() : null;
    }
}