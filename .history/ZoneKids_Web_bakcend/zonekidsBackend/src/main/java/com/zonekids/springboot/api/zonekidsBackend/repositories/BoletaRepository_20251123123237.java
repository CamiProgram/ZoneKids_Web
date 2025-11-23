package com.zonekids.springboot.api.zonekidsBackend.repositories;

import com.zonekids.springboot.api.zonekidsBackend.entities.Boleta;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para Boleta
 */
@Repository
public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    List<Boleta> findByUsuario(User usuario);
    Optional<Boleta> findByNumeroBoleta(String numeroBoleta);
    List<Boleta> findByEstado(String estado);
    List<Boleta> findByUsuarioAndEstado(User usuario, String estado);
}
