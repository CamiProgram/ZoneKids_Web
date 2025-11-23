package com.zonekids.springboot.api.zonekidsBackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Clase genérica para estandarizar todas las respuestas API
 * Estructura esperada por el frontend
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private List<ErrorField> errors;
    private String timestamp;

    // Constructores
    public ApiResponse() {
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
    }

    public ApiResponse(boolean success, String message) {
        this();
        this.success = success;
        this.message = message;
    }

    public ApiResponse(boolean success, String message, T data) {
        this();
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(boolean success, String message, T data, List<ErrorField> errors) {
        this();
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }

    // Métodos estáticos para crear respuestas comunes
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message);
    }

    public static <T> ApiResponse<T> error(String message, List<ErrorField> errors) {
        return new ApiResponse<>(false, message, null, errors);
    }

    // Getters y Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public List<ErrorField> getErrors() {
        return errors;
    }

    public void setErrors(List<ErrorField> errors) {
        this.errors = errors;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * Clase interna para representar errores de campo
     */
    public static class ErrorField {
        private String field;
        private String defaultMessage;

        public ErrorField() {}

        public ErrorField(String field, String defaultMessage) {
            this.field = field;
            this.defaultMessage = defaultMessage;
        }

        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public String getDefaultMessage() {
            return defaultMessage;
        }

        public void setDefaultMessage(String defaultMessage) {
            this.defaultMessage = defaultMessage;
        }
    }
}
