package com.zonekids.springboot.api.zonekidsBackend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * DTO para crear o actualizar un producto
 * Incluye validación para 2-3 imágenes
 */
@Getter
@Setter

@NoArgsConstructor
public class ProductoRequestDto {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @Min(value = 0, message = "El precio no puede ser negativo")
    private Long precio; // Precio en número entero (sin decimales)

    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private String categoria;

    /**
     * Lista de URLs de imágenes (mínimo 2, máximo 3)
     */
    private List<String> imagenesUrl;

    @Min(value = 0)
    private Long precioOriginal; // Precio original en número entero

    private boolean esNuevo = false;

    private boolean enOferta = false;

    // Getters y Setters - Generados por Lombok pero agregados explícitamente
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Long getPrecio() { return precio; }
    public void setPrecio(Long precio) { this.precio = precio; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public List<String> getImagenesUrl() { return imagenesUrl; }
    public void setImagenesUrl(List<String> imagenesUrl) { this.imagenesUrl = imagenesUrl; }
    public Long getPrecioOriginal() { return precioOriginal; }
    public void setPrecioOriginal(Long precioOriginal) { this.precioOriginal = precioOriginal; }
    public boolean isEsNuevo() { return esNuevo; }
    public void setEsNuevo(boolean esNuevo) { this.esNuevo = esNuevo; }
    public boolean isEnOferta() { return enOferta; }
    public void setEnOferta(boolean enOferta) { this.enOferta = enOferta; }
}


