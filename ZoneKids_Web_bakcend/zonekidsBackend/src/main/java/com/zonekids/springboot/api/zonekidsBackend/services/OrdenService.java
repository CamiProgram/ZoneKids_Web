package com.zonekids.springboot.api.zonekidsBackend.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.Orden;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import java.util.List;
import java.util.Optional;

/**
 * Interfaz de servicio para la gestión de órdenes
 */
public interface OrdenService {
    
    /**
     * Obtiene todas las órdenes
     */
    List<Orden> obtenerTodas();

    /**
     * Obtiene una orden por ID
     */
    Optional<Orden> obtenerPorId(Long id);

    /**
     * Crea una nueva orden
     */
    Orden crear(Orden orden);

    /**
     * Actualiza una orden existente
     */
    Orden actualizar(Orden orden);

    /**
     * Elimina una orden por ID
     */
    void eliminar(Long id);

    /**
     * Obtiene todas las órdenes de un usuario específico
     */
    List<Orden> obtenerPorUsuario(User usuario);

    /**
     * Obtiene órdenes por estado
     */
    List<Orden> obtenerPorEstado(String estado);
}
