package com.zonekids.springboot.api.zonekidsBackend.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User saveUser(User user) {
        // Encriptar la contraseña antes de guardar si no está ya en formato BCrypt
        if (user.getContrasena() != null && !user.getContrasena().startsWith("$2a$") && !user.getContrasena().startsWith("$2b$")) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String encoded = encoder.encode(user.getContrasena());
            user.setContrasena(encoded);
        }
        return userRepository.save(user);
    }

    @Override
    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}