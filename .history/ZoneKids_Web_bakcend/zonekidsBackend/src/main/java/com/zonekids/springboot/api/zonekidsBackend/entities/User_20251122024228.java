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
    @Column(nullable = true)
    private LocalDateTime fechaActualizacion;

    // Getters y Setters generados por Lombok (@Getter, @Setter)
    // No necesitamos agregarlos manualmente

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public RoleEnum getRol() {
        return rol;
    }

    public void setRol(RoleEnum rol) {
        this.rol = rol;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    /**
     * Método helper para obtener el rol como String
     */
    public String getRolString() {
        return this.rol != null ? this.rol.getValor() : null;
    }
}
