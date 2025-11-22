package com.zonekids.springboot.api.zonekidsBackend.repositories;

import com.zonekids.springboot.api.zonekidsBackend.entities.DetalleOrden;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para la entidad DetalleOrden
 */
public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Long> {
}
