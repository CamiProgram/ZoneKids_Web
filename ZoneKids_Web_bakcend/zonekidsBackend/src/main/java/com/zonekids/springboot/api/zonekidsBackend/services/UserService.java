package com.zonekids.springboot.api.zonekidsBackend.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAllUsers();
    Optional<User> findUserById(Long id);
    User saveUser(User user); // Usado para crear y actualizar
    void deleteUserById(Long id); // Para borrado físico (si lo implementas)
    Optional<User> findUserByEmail(String email); // Necesario para login/registro
}