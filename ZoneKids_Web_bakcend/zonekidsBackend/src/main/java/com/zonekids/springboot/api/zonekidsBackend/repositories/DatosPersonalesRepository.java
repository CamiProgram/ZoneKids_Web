package com.zonekids.springboot.api.zonekidsBackend.repositories;

import com.zonekids.springboot.api.zonekidsBackend.entities.DatosPersonales;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para DatosPersonales
 */
@Repository
public interface DatosPersonalesRepository extends JpaRepository<DatosPersonales, Long> {
    Optional<DatosPersonales> findByUsuario(User usuario);
    Optional<DatosPersonales> findByRut(String rut);
}
