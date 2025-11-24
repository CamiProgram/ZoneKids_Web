package com.zonekids.springboot.api.zonekidsBackend.dto;

import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO para actualizar las imágenes de un producto")
public class ActualizarImagenesRequest {

    @Schema(description = "Lista de URLs de imágenes (mínimo 2, máximo 3)", example = "[\"uploads/image1.avif\", \"uploads/image2.avif\"]")
    private List<String> imagenesUrl;

    public ActualizarImagenesRequest() {
    }

    public ActualizarImagenesRequest(List<String> imagenesUrl) {
        this.imagenesUrl = imagenesUrl;
    }

    public List<String> getImagenesUrl() {
        return imagenesUrl;
    }

    public void setImagenesUrl(List<String> imagenesUrl) {
        this.imagenesUrl = imagenesUrl;
    }

    @Override
    public String toString() {
        return "ActualizarImagenesRequest{" +
                "imagenesUrl=" + imagenesUrl +
                '}';
    }
}
