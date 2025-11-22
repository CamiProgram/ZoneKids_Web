package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users") // URL base para usuarios
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Crear usuario (usado por el admin)
    @PostMapping 
    public User createUser(@Valid @RequestBody User user) {
        return userService.saveUser(user); 
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User userDetails) {
        return userService.findUserById(id)
                .map(user -> {
                    user.setNombre(userDetails.getNombre());
                    user.setEmail(userDetails.getEmail());
                    user.setRol(userDetails.getRol());
                    user.setEstado(userDetails.getEstado());
                    // Considerar la actualización de contraseña aquí
                    return ResponseEntity.ok(userService.saveUser(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
         if (userService.findUserById(id).isPresent()) {
             userService.deleteUserById(id);
             return ResponseEntity.noContent().build(); // Código 204: Éxito sin contenido
         } else {
            return ResponseEntity.notFound().build(); // Código 404: No encontrado
         }
    }
}