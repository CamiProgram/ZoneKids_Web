package com.zonekids.springboot.api.zonekidsBackend.exception;

/**
 * Excepción personalizada para recursos no encontrados
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
