package com.zonekids.springboot.api.zonekidsBackend.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.Boleta;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import java.util.List;
import java.util.Optional;

/**
 * Interfaz de servicio para Boleta
 */
public interface BoletaService {
    Boleta saveBoleta(Boleta boleta);
    Optional<Boleta> findBoletaById(Long id);
    List<Boleta> findAll();
    List<Boleta> findBoletasByUsuario(User usuario);
    Optional<Boleta> findBoletaByNumeroBoleta(String numeroBoleta);
    List<Boleta> findBoletasByEstado(String estado);
    List<Boleta> findBoletasByUsuarioAndEstado(User usuario, String estado);
    void deleteBoletaById(Long id);
    String generarNumeroBoleta();
}
