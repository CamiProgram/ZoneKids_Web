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