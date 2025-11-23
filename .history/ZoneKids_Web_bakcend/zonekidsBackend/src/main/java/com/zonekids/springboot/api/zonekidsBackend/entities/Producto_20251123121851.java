package com.zonekids.springboot.api.zonekidsBackend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Min(value = 0, message = "El precio no puede ser negativo")
    @Column(nullable = false)
    private Long precio; // Precio en número entero (sin decimales, sin comas)

    @Min(value = 0, message = "El stock no puede ser negativo")
    @Column(nullable = false)
    private Integer stock; 

    private String categoria;

    /**
     * URLs de imágenes del producto (mínimo 2, máximo 3)
     * Almacenadas como JSON en la BD mediante @ElementCollection
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "producto_imagenes", joinColumns = @JoinColumn(name = "producto_id"))
    @Column(name = "imagen_url")
    private List<String> imagenesUrl = new ArrayList<>();

    private String estado; // "activo", "inactivo"

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime fechaCreacion;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime fechaActualizacion;
    
    @Min(value = 0)
    private Long precioOriginal; // Precio original en número entero

    private boolean esNuevo = false; 

    private boolean enOferta = false;

    /**
     * Valida que el producto tenga entre 2 y 3 imágenes
     */
    @PrePersist
    @PreUpdate
    private void validarImagenes() {
        if (imagenesUrl == null) {
            imagenesUrl = new ArrayList<>();
        }
        
        if (imagenesUrl.size() < 2) {
            throw new IllegalArgumentException("El producto debe tener mínimo 2 imágenes");
        }
        
        if (imagenesUrl.size() > 3) {
            throw new IllegalArgumentException("El producto puede tener máximo 3 imágenes");
        }
    }

    /**
     * Método helper para agregar una imagen
     */
    public void agregarImagen(String imagenUrl) {
        if (imagenesUrl == null) {
            imagenesUrl = new ArrayList<>();
        }
        if (imagenesUrl.size() >= 3) {
            throw new IllegalArgumentException("No se pueden agregar más de 3 imágenes");
        }
        imagenesUrl.add(imagenUrl);
    }

    // Getters y Setters
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getPrecio() {
        return precio == null ? null : precio.doubleValue();
    }

    public void setPrecio(Double precio) {
        this.precio = precio == null ? null : precio.longValue();
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public List<String> getImagenesUrl() {
        return imagenesUrl;
    }

    public void setImagenesUrl(List<String> imagenesUrl) {
        this.imagenesUrl = imagenesUrl;
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

    public Double getPrecioOriginal() {
        return precioOriginal == null ? null : precioOriginal.doubleValue();
    }

    public void setPrecioOriginal(Double precioOriginal) {
        this.precioOriginal = precioOriginal == null ? null : precioOriginal.longValue();
    }

    public boolean isEsNuevo() {
        return esNuevo;
    }

    public void setEsNuevo(boolean esNuevo) {
        this.esNuevo = esNuevo;
    }

    public boolean isEnOferta() {
        return enOferta;
    }

    public void setEnOferta(boolean enOferta) {
        this.enOferta = enOferta;
    }

}
