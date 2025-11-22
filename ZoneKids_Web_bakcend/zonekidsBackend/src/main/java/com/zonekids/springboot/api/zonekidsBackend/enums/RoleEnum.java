package com.zonekids.springboot.api.zonekidsBackend.enums;

/**
 * Enum para los roles de usuario en el sistema
 */
public enum RoleEnum {
    ADMIN("admin", "Administrador del sistema"),
    VENDEDOR("vendedor", "Vendedor de productos"),
    CLIENTE("cliente", "Cliente de la tienda");

    private final String valor;
    private final String descripcion;

    RoleEnum(String valor, String descripcion) {
        this.valor = valor;
        this.descripcion = descripcion;
    }

    public String getValor() {
        return valor;
    }

    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Convierte un String al enum correspondiente
     */
    public static RoleEnum fromString(String valor) {
        for (RoleEnum role : RoleEnum.values()) {
            if (role.valor.equalsIgnoreCase(valor)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Rol inválido: " + valor);
    }
}
