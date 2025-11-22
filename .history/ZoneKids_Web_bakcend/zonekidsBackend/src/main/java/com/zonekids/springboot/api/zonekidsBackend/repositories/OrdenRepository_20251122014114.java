package com.zonekids.springboot.api.zonekidsBackend.repositories;

import com.zonekids.springboot.api.zonekidsBackend.entities.Orden;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repositorio para la entidad Orden
 */
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    
    /**
     * Busca todas las órdenes de un usuario específico
     */
    List<Orden> findByUsuario(User usuario);

    /**
     * Busca órdenes por estado
     */
    List<Orden> findByEstado(String estado);
}
