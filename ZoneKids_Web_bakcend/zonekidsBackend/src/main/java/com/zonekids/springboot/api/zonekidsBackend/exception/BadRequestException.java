package com.zonekids.springboot.api.zonekidsBackend.exception;

/**
 * Excepción personalizada para solicitudes inválidas
 */
public class BadRequestException extends RuntimeException {
    
    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
