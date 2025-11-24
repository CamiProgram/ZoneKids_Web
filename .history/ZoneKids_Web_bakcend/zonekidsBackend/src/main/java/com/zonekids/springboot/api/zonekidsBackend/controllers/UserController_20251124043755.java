package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.dto.ApiResponse;
import com.zonekids.springboot.api.zonekidsBackend.dto.UsuarioRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.UsuarioResponseDto;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.enums.RoleEnum;
import com.zonekids.springboot.api.zonekidsBackend.exception.BadRequestException;
import com.zonekids.springboot.api.zonekidsBackend.exception.ResourceNotFoundException;
import com.zonekids.springboot.api.zonekidsBackend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador de Usuarios con versionamiento /api/v1/
 * Solo ADMIN puede gestionar usuarios
 * Proporciona CRUD completo y gestión de roles
 */
@RestController
@RequestMapping("/api/v1/usuarios")
@Tag(name = "Usuarios", description = "Endpoints para gestión de usuarios (Solo ADMIN)")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Obtener todos los usuarios (Solo ADMIN)
     */
    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Obtiene todos los usuarios del sistema")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obtenerTodos() {
        List<User> users = userService.findAllUsers();
        List<UsuarioResponseDto> response = users.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Usuarios obtenidos", response));
    }

    /**
     * Obtener un usuario por ID (Solo ADMIN)
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Obtiene los detalles de un usuario específico")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        var userOpt = userService.findUserById(id);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException("Usuario con ID " + id + " no encontrado");
        }
        return ResponseEntity.ok(ApiResponse.success("Usuario obtenido", convertirADto(userOpt.get())));
    }

    /**
     * Crear un nuevo usuario (Solo ADMIN)
     */
    @PostMapping
    @Operation(summary = "Crear usuario", description = "Crea un nuevo usuario con rol específico (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crear(@Valid @RequestBody UsuarioRequestDto usuarioRequest) {
        // Verificar que el email no exista
        if (userService.findUserByEmail(usuarioRequest.getEmail()).isPresent()) {
            throw new BadRequestException("El email " + usuarioRequest.getEmail() + " ya está registrado");
        }

        // Crear usuario
        User newUser = new User();
        newUser.setNombre(usuarioRequest.getNombre());
        newUser.setEmail(usuarioRequest.getEmail());
        newUser.setContrasena(usuarioRequest.getContrasena());

        // Asignar rol validado
        try {
            RoleEnum rol = RoleEnum.fromString(usuarioRequest.getRol());
            newUser.setRol(rol);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Rol inválido. Use: admin, vendedor, cliente");
        }

        newUser.setEstado("activo");

        // Guardar usuario
        User savedUser = userService.saveUser(newUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Usuario creado exitosamente", convertirADto(savedUser)));
    }

    /**
     * Actualizar un usuario (Solo ADMIN)
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario existente")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioRequestDto usuarioRequest) {
        User user = userService.findUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con ID " + id + " no encontrado"));

        user.setNombre(usuarioRequest.getNombre());
        user.setEmail(usuarioRequest.getEmail());
        // Codificar la contraseña con BCrypt
        user.setContrasena(passwordEncoder.encode(usuarioRequest.getContrasena()));

        try {
            RoleEnum rol = RoleEnum.fromString(usuarioRequest.getRol());
            user.setRol(rol);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Rol inválido. Use: admin, vendedor, cliente");
        }

        User updatedUser = userService.saveUser(user);
        return ResponseEntity.ok(ApiResponse.success("Usuario actualizado exitosamente", convertirADto(updatedUser)));
    }

    /**
     * Cambiar estado de un usuario (Solo ADMIN)
     */
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado de usuario", description = "Activa o desactiva un usuario")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam String estado) {
        if (!estado.equals("activo") && !estado.equals("inactivo")) {
            throw new BadRequestException("Estado inválido. Use: activo, inactivo");
        }

        User user = userService.findUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con ID " + id + " no encontrado"));

        user.setEstado(estado);
        User updatedUser = userService.saveUser(user);
        return ResponseEntity.ok(ApiResponse.success("Estado actualizado exitosamente", convertirADto(updatedUser)));
    }

    /**
     * Eliminar un usuario (Solo ADMIN)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario del sistema")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        User user = userService.findUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con ID " + id + " no encontrado"));

        userService.deleteUserById(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario eliminado exitosamente", null));
    }

    /**
     * Método helper para convertir User a UsuarioResponseDto
     */
    private UsuarioResponseDto convertirADto(User user) {
        UsuarioResponseDto dto = new UsuarioResponseDto();
        dto.setId(user.getId());
        dto.setNombre(user.getNombre());
        dto.setEmail(user.getEmail());
        dto.setRol(user.getRol());
        dto.setEstado(user.getEstado());
        dto.setFechaCreacion(user.getFechaCreacion());
        dto.setFechaActualizacion(user.getFechaActualizacion());
        return dto;
    }
}