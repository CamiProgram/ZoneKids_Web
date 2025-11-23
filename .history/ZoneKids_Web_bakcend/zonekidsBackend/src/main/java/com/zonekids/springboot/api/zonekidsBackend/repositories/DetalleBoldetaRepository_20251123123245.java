package com.zonekids.springboot.api.zonekidsBackend.repositories;

import com.zonekids.springboot.api.zonekidsBackend.entities.DetalleBoleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para DetalleBoleta
 */
@Repository
public interface DetalleBoldetaRepository extends JpaRepository<DetalleBoleta, Long> {
    List<DetalleBoleta> findByBoletaId(Long boletaId);
}
