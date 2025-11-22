package com.zonekids.springboot.api.zonekidsBackend.services;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileSystemStorageService implements StorageService {

    private final Path rootLocation;

    public FileSystemStorageService() {
        this.rootLocation = Paths.get("uploads");
        init(); 
    }

    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new StorageException("No se pudo inicializar el almacenamiento", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new StorageException("No se puede guardar un archivo vacío.");
            }
            // Validar tipo MIME para aceptar solo imágenes
            String contentType = file.getContentType();
            if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
                throw new StorageException("Solo se permiten archivos de imagen (image/*).");
            }
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                 extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            Path destinationFile = this.rootLocation.resolve(Paths.get(filename)).normalize().toAbsolutePath();
            if (!destinationFile.getParent().equals(this.rootLocation.toAbsolutePath())) {
                throw new StorageException("No se puede guardar el archivo fuera del directorio actual.");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
                return filename; 
            }
        } catch (IOException e) {
            throw new StorageException("Falló al guardar el archivo.", e);
        }
    }

    @Override
    public Path load(String filename) { return rootLocation.resolve(filename); }

    @Override
    public Resource loadAsResource(String filename) {
        try {
            Path file = load(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) { return resource; } 
            else { throw new StorageFileNotFoundException("No se pudo leer el archivo: " + filename); }
        } catch (MalformedURLException e) { throw new StorageFileNotFoundException("No se pudo leer el archivo: " + filename, e); }
    }

    @Override
    public void deleteAll() { FileSystemUtils.deleteRecursively(rootLocation.toFile()); }
}

class StorageException extends RuntimeException {
    public StorageException(String message) { super(message); }
    public StorageException(String message, Throwable cause) { super(message, cause); }
}

class StorageFileNotFoundException extends StorageException {
    public StorageFileNotFoundException(String message) { super(message); }
    public StorageFileNotFoundException(String message, Throwable cause) { super(message, cause); }
}