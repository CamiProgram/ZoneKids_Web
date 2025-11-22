package com.zonekids.springboot.api.zonekidsBackend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.repositories.UserRepository;

@Configuration
public class AdminUserConfig {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeAdmin(UserRepository userRepository) {
        return args -> {
            String adminEmail = "camilotapia828@gmail.com";
            
            // Verifica si el usuario ya existe
            if (!userRepository.findByEmail(adminEmail).isPresent()) {
                // Crear nuevo usuario admin
                User adminUser = new User();
                adminUser.setNombre("Camilo Admin");
                adminUser.setEmail(adminEmail);
                adminUser.setContrasena(passwordEncoder.encode("admin123")); // Asegúrate de cambiar esta contraseña
                adminUser.setRol("super-admin");
                adminUser.setEstado("activo");
                userRepository.save(adminUser);
            } else {
                // Si el usuario existe, asegurarse de que tenga rol de admin
                userRepository.findByEmail(adminEmail).ifPresent(user -> {
                    if (!user.getRol().equals("super-admin")) {
                        user.setRol("super-admin");
                        userRepository.save(user);
                    }
                });
            }
        };
    }
}