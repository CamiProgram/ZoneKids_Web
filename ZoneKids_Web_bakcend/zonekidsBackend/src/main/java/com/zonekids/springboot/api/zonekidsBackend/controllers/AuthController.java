package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String contrasenaIngresada = credentials.get("contrasena"); 

        Optional<User> userOptional = userService.findUserByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }

        User user = userOptional.get();
        String contrasenaGuardada = user.getContrasena(); 

        // Usar BCrypt para comparar la contraseña ingresada con la guardada
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        if (encoder.matches(contrasenaIngresada, contrasenaGuardada)) {
            if (user.getEstado().equals("inactivo")) {
                 return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tu cuenta ha sido deshabilitada.");
            }
            return ResponseEntity.ok(user); 
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User newUser) {
        if (userService.findUserByEmail(newUser.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El email ya está registrado");
        }
        newUser.setRol("cliente"); 
        newUser.setEstado("activo"); 
        try {
            User savedUser = userService.saveUser(newUser); 
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar el usuario");
        }
    }
}