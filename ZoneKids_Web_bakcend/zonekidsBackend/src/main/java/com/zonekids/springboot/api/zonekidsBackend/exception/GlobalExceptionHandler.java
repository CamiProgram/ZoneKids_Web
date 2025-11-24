package com.zonekids.springboot.api.zonekidsBackend.exception;

import com.zonekids.springboot.api.zonekidsBackend.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones para toda la aplicación
 * Convierte excepciones en respuestas JSON coherentes
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Maneja excepciones de validación (MethodArgumentNotValidException)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Errores de validación"));
    }

    /**
     * Maneja excepciones de tipo de argumento incorrecto
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleTypeMismatchException(MethodArgumentTypeMismatchException ex, WebRequest request) {
        String error = String.format("El parámetro '%s' debe ser de tipo %s", 
                ex.getName(), ex.getRequiredType().getSimpleName());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(error));
    }

    /**
     * Maneja excepciones de acceso denegado (Unauthorized)
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Acceso denegado: no tienes permisos para acceder a este recurso"));
    }

    /**
     * Maneja 404 cuando no se encuentra la ruta
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<?> handleNoHandlerFoundException(NoHandlerFoundException ex, WebRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(String.format("Endpoint no encontrado: %s %s", ex.getHttpMethod(), ex.getRequestURL())));
    }

    /**
     * Maneja excepciones de recurso no encontrado personalizadas
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Maneja excepciones de solicitud invalida personalizadas
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequestException(BadRequestException ex, WebRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        ex.printStackTrace(); // Log for debugging
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Argumento inválido: " + ex.getMessage()));
    }

    /**
     * Maneja todas las excepciones no específicas
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        // Log la excepción para debugging
        ex.printStackTrace();
        
        // Retornar un error genérico sin exponer detalles internos
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error interno del servidor. Por favor, contacta al administrador. Error: " + ex.getClass().getSimpleName()));
    }
}
