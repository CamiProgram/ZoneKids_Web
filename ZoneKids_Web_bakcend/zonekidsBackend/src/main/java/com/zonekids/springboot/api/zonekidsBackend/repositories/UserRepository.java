package com.zonekids.springboot.api.zonekidsBackend.repositories; // Cambiado a 'repositories'

import com.zonekids.springboot.api.zonekidsBackend.entities.User; // Usa tu paquete 'entities'
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// JpaRepository<TipoDeEntidad, TipoDelId>
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Método para buscar por email (usado en login/registro)
    Optional<User> findByEmail(String email);
}