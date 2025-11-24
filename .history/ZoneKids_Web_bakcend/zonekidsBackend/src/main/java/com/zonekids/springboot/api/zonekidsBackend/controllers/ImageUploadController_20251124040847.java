package com.zonekids.springboot.api.zonekidsBackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.zonekids.springboot.api.zonekidsBackend.services.FileSystemStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador especializado para upload de imágenes
 * Maneja la carga de archivos de imagen de forma separada
 * Requiere autenticación ADMIN
 */
@RestController
@RequestMapping("/api/v1/upload")
@Tag(name = "Upload", description = "Endpoints para subir imágenes (Solo ADMIN)")
@SecurityRequirement(name = "Bearer Authentication")
public class ImageUploadController {

    @Autowired
    private FileSystemStorageService storageService;

    /**
     * Endpoint para subir una imagen (solo ADMIN)
     * @param file Archivo de imagen
     * @return Información del archivo subido
     */
    @PostMapping("/imagen")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Subir una imagen", description = "Sube una imagen al servidor (Solo ADMIN)")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "El archivo está vacío");
                error.put("status", HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.badRequest().body(error);
            }

            // Validar tipo de archivo (solo imágenes)
            String contentType = file.getContentType();
            if (!isImageFile(contentType)) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP, AVIF)");
                error.put("status", HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.badRequest().body(error);
            }

            // Validar tamaño máximo (10MB)
            long maxFileSize = 10 * 1024 * 1024; // 10MB
            if (file.getSize() > maxFileSize) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "El archivo excede el tamaño máximo permitido (10MB)");
                error.put("status", HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.badRequest().body(error);
            }

            // Guardar el archivo
            String fileName = storageService.store(file);

            // Preparar respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("fileName", fileName);
            response.put("size", file.getSize());
            response.put("contentType", contentType);
            response.put("url", "/uploads/" + fileName);
            response.put("message", "Imagen subida exitosamente");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al procesar la imagen: " + e.getMessage());
            error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Validar si el archivo es una imagen
     */
    private boolean isImageFile(String contentType) {
        if (contentType == null) {
            return false;
        }
        return contentType.equals("image/jpeg") ||
               contentType.equals("image/png") ||
               contentType.equals("image/gif") ||
               contentType.equals("image/webp") ||
               contentType.equals("image/avif");
    }

    /**
     * Endpoint para subir múltiples imágenes (solo ADMIN)
     * @param files Array de archivos de imagen
     * @return Lista de información de archivos subidos
     */
    @PostMapping("/imagenes")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Subir múltiples imágenes", description = "Sube múltiples imágenes al servidor (Solo ADMIN)")
    public ResponseEntity<?> uploadImages(@RequestParam("files") MultipartFile[] files) {
        try {
            if (files == null || files.length == 0) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "No se proporcionaron archivos");
                error.put("status", HttpStatus.BAD_REQUEST.value());
                return ResponseEntity.badRequest().body(error);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalFiles", files.length);

            java.util.List<Map<String, Object>> uploadedFiles = new java.util.ArrayList<>();

                    java.util.List<Map<String, Object>> errors = new java.util.ArrayList<>();

            for (MultipartFile file : files) {
                try {
                    if (!file.isEmpty() && isImageFile(file.getContentType())) {
                        String fileName = storageService.store(file);
                        Map<String, Object> fileInfo = new HashMap<>();
                        fileInfo.put("fileName", fileName);
                        fileInfo.put("size", file.getSize());
                        fileInfo.put("url", "/uploads/" + fileName);
                        uploadedFiles.add(fileInfo);
                    }
                } catch (Exception e) {
                    Map<String, Object> errorInfo = new HashMap<>();
                    errorInfo.put("fileName", file.getOriginalFilename());
                    errorInfo.put("error", e.getMessage());
                    errors.add(errorInfo);
                }
            }

            response.put("uploadedFiles", uploadedFiles);
            response.put("errors", errors);
            response.put("uploadedCount", uploadedFiles.size());
            response.put("message", "Proceso de subida de imágenes completado.");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al procesar las imágenes: " + e.getMessage());
            error.put("timestamp", java.time.LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
