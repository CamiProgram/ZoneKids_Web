package com.zonekids.springboot.api.zonekidsBackend.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.Orden;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.repositories.OrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Implementación del servicio de órdenes
 */
@Service
public class OrdenServiceImpl implements OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    @Override
    public List<Orden> obtenerTodas() {
        return ordenRepository.findAll();
    }

    @Override
    public Optional<Orden> obtenerPorId(Long id) {
        return ordenRepository.findById(id);
    }

    @Override
    public Orden crear(Orden orden) {
        orden.actualizarTotal();
        return ordenRepository.save(orden);
    }

    @Override
    public Orden actualizar(Orden orden) {
        orden.actualizarTotal();
        return ordenRepository.save(orden);
    }

    @Override
    public void eliminar(Long id) {
        ordenRepository.deleteById(id);
    }

    @Override
    public List<Orden> obtenerPorUsuario(User usuario) {
        return ordenRepository.findByUsuario(usuario);
    }

    @Override
    public List<Orden> obtenerPorEstado(String estado) {
        return ordenRepository.findByEstado(estado);
    }
}
