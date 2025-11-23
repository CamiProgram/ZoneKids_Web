package com.zonekids.springboot.api.zonekidsBackend.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.DatosPersonales;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import java.util.Optional;

/**
 * Interfaz de servicio para DatosPersonales
 */
public interface DatosPersonalesService {
    DatosPersonales saveDatosPersonales(DatosPersonales datosPersonales);
    Optional<DatosPersonales> findDatosPersonalesById(Long id);
    Optional<DatosPersonales> findDatosPersonalesByUsuario(User usuario);
    Optional<DatosPersonales> findDatosPersonalesByRut(String rut);
    void deleteDatosPersonalesById(Long id);
}
