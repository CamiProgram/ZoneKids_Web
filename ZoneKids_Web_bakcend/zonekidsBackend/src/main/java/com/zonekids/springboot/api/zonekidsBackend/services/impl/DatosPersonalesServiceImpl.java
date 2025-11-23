package com.zonekids.springboot.api.zonekidsBackend.services.impl;

import com.zonekids.springboot.api.zonekidsBackend.entities.DatosPersonales;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.repositories.DatosPersonalesRepository;
import com.zonekids.springboot.api.zonekidsBackend.services.DatosPersonalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Implementación del servicio DatosPersonalesService
 */
@Service
public class DatosPersonalesServiceImpl implements DatosPersonalesService {

    @Autowired
    private DatosPersonalesRepository datosPersonalesRepository;

    @Override
    public DatosPersonales saveDatosPersonales(DatosPersonales datosPersonales) {
        return datosPersonalesRepository.save(datosPersonales);
    }

    @Override
    public Optional<DatosPersonales> findDatosPersonalesById(Long id) {
        return datosPersonalesRepository.findById(id);
    }

    @Override
    public Optional<DatosPersonales> findDatosPersonalesByUsuario(User usuario) {
        return datosPersonalesRepository.findByUsuario(usuario);
    }

    @Override
    public Optional<DatosPersonales> findDatosPersonalesByRut(String rut) {
        return datosPersonalesRepository.findByRut(rut);
    }

    @Override
    public void deleteDatosPersonalesById(Long id) {
        datosPersonalesRepository.deleteById(id);
    }
}
