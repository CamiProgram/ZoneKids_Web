package com.zonekids.springboot.api.zonekidsBackend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.enums.RoleEnum;
import com.zonekids.springboot.api.zonekidsBackend.repositories.UserRepository;

/**
 * Configuración para inicializar un usuario ADMIN por defecto en la BD
 * Se ejecuta al iniciar la aplicación si el usuario no existe
 */
@Configuration
public class AdminUserConfig {

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Crea un usuario ADMIN por defecto si no existe
     */
    @Bean
    public CommandLineRunner initializeAdmin(UserRepository userRepository) {
        return args -> {
            String adminEmail = "camilotapia828@gmail.com";
            
            // Verifica si el usuario admin ya existe
            if (!userRepository.findByEmail(adminEmail).isPresent()) {
                // Crear nuevo usuario admin
                User adminUser = new User();
                adminUser.setNombre("Camilo Admin");
                adminUser.setEmail(adminEmail);
                adminUser.setContrasena(passwordEncoder.encode("admin123")); // Cambiar en producción
                adminUser.setRol(RoleEnum.ADMIN);
                adminUser.setEstado("activo");
                userRepository.save(adminUser);
                System.out.println("✓ Usuario ADMIN creado exitosamente");
            } else {
                // Si el usuario existe, asegurarse de que tenga rol ADMIN
                userRepository.findByEmail(adminEmail).ifPresent(user -> {
                    if (!user.getRol().equals(RoleEnum.ADMIN)) {
                        user.setRol(RoleEnum.ADMIN);
                        userRepository.save(user);
                        System.out.println("✓ Rol ADMIN actualizado para el usuario");
                    }
                });
            }
        };
    }
}