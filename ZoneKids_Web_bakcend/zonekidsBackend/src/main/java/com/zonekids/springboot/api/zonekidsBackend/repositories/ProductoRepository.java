package com.zonekids.springboot.api.zonekidsBackend.repositories; // Cambiado a 'repositories'

import com.zonekids.springboot.api.zonekidsBackend.entities.Producto; // Usa tu paquete 'entities'
import org.springframework.data.jpa.repository.JpaRepository;

// JpaRepository<TipoDeEntidad, TipoDelId>
public interface ProductoRepository extends JpaRepository<Producto, Long> { // Cambia Producto a Product si renombraste la entidad
    // JpaRepository ya provee: findAll, findById, save, deleteById, etc.
}