package com.zonekids.springboot.api.zonekidsBackend.services.impl;

import com.zonekids.springboot.api.zonekidsBackend.entities.Boleta;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.repositories.BoletaRepository;
import com.zonekids.springboot.api.zonekidsBackend.services.BoletaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * Implementación del servicio BoletaService
 */
@Service
public class BoletaServiceImpl implements BoletaService {

    @Autowired
    private BoletaRepository boletaRepository;

    @Override
    public Boleta saveBoleta(Boleta boleta) {
        return boletaRepository.save(boleta);
    }

    @Override
    public Optional<Boleta> findBoletaById(Long id) {
        return boletaRepository.findById(id);
    }

    @Override
    public List<Boleta> findBoletasByUsuario(User usuario) {
        return boletaRepository.findByUsuario(usuario);
    }

    @Override
    public Optional<Boleta> findBoletaByNumeroBoleta(String numeroBoleta) {
        return boletaRepository.findByNumeroBoleta(numeroBoleta);
    }

    @Override
    public List<Boleta> findBoletasByEstado(String estado) {
        return boletaRepository.findByEstado(estado);
    }

    @Override
    public List<Boleta> findBoletasByUsuarioAndEstado(User usuario, String estado) {
        return boletaRepository.findByUsuarioAndEstado(usuario, estado);
    }

    @Override
    public void deleteBoletaById(Long id) {
        boletaRepository.deleteById(id);
    }

    /**
     * Genera un número de boleta único en formato: BOL-YYYYMMDD-NNNNN
     * Ejemplo: BOL-20251123-00001
     */
    @Override
    public String generarNumeroBoleta() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String fecha = LocalDateTime.now().format(formatter);
        
        // Obtener el contador de boletas del día
        long contador = boletaRepository.findAll().stream()
                .filter(b -> b.getNumeroBoleta().contains(fecha))
                .count() + 1;
        
        return String.format("BOL-%s-%05d", fecha, contador);
    }
}
