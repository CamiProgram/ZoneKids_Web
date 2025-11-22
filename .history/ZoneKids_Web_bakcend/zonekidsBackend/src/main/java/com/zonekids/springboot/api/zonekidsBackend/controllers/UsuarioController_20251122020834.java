package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.dto.UsuarioRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.UsuarioResponseDto;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.enums.RoleEnum;
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
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Controlador de Usuarios con versionamiento /api/v1/
 * Solo ADMIN puede gestionar usuarios
 */
@RestController
@RequestMapping("/api/v1/usuarios")
@Tag(name = "Usuarios", description = "Endpoints para gestión de usuarios (Solo ADMIN)")
@SecurityRequirement(name = "Bearer Authentication")
public class UsuarioController {

    @Autowired
    private UserService userService;

    /**
     * Obtener todos los usuarios (solo ADMIN)
     */
    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Obtiene todos los usuarios del sistema (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponseDto>> obtenerTodos() {
        List<User> usuarios = userService.findAllUsers();
        List<UsuarioResponseDto> response = usuarios.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Obtener un usuario por ID (solo ADMIN)
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Obtiene los detalles de un usuario (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        Optional<User> usuario = userService.findUserById(id);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(convertirADto(usuario.get()));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }

    /**
     * Crear un nuevo usuario (solo ADMIN)
     * ADMIN puede asignar cualquier rol
     */
    @PostMapping
    @Operation(summary = "Crear usuario", description = "Crea un nuevo usuario con rol especificado (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crear(@Valid @RequestBody UsuarioRequestDto usuarioRequest) {
        try {
            // Verificar que el email no esté registrado
            if (userService.findUserByEmail(usuarioRequest.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("El email ya está registrado");
            }

            // Crear nuevo usuario
            User newUser = new User();
            newUser.setNombre(usuarioRequest.getNombre());
            newUser.setEmail(usuarioRequest.getEmail());
            newUser.setContrasena(usuarioRequest.getContrasena());
            
            // ADMIN puede asignar cualquier rol
            try {
                RoleEnum rol = RoleEnum.fromString(usuarioRequest.getRol());
                newUser.setRol(rol);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Rol inválido. Valores válidos: admin, vendedor, cliente");
            }
            
            newUser.setEstado("activo");

            // Guardar el usuario
            User savedUser = userService.saveUser(newUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertirADto(savedUser));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el usuario: " + e.getMessage());
        }
    }

    /**
     * Actualizar un usuario (solo ADMIN)
     */
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario existente (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioRequestDto usuarioRequest) {
        try {
            Optional<User> usuarioOpt = userService.findUserById(id);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }

            User usuario = usuarioOpt.get();
            usuario.setNombre(usuarioRequest.getNombre());
            usuario.setEmail(usuarioRequest.getEmail());
            usuario.setContrasena(usuarioRequest.getContrasena());
            
            // Cambiar rol si es diferente
            try {
                RoleEnum rol = RoleEnum.fromString(usuarioRequest.getRol());
                usuario.setRol(rol);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Rol inválido. Valores válidos: admin, vendedor, cliente");
            }

            User updatedUser = userService.saveUser(usuario);
            return ResponseEntity.ok(convertirADto(updatedUser));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el usuario: " + e.getMessage());
        }
    }

    /**
     * Cambiar estado del usuario (activo/inactivo)
     */
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Cambiar estado del usuario", description = "Activa o desactiva un usuario (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam String estado) {
        try {
            Optional<User> usuarioOpt = userService.findUserById(id);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }

            if (!estado.equals("activo") && !estado.equals("inactivo")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Estado inválido. Valores válidos: activo, inactivo");
            }

            User usuario = usuarioOpt.get();
            usuario.setEstado(estado);
            User updatedUser = userService.saveUser(usuario);
            
            UsuarioResponseDto response = new UsuarioResponseDto();
            response.setId(updatedUser.getId());
            response.setNombre(updatedUser.getNombre());
            response.setEmail(updatedUser.getEmail());
            response.setRol(updatedUser.getRol());
            response.setEstado(updatedUser.getEstado());
            response.setFechaCreacion(updatedUser.getFechaCreacion());
            response.setFechaActualizacion(updatedUser.getFechaActualizacion());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cambiar el estado del usuario: " + e.getMessage());
        }
    }

    /**
     * Eliminar un usuario (solo ADMIN)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario del sistema (Solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            if (!userService.findUserById(id).isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
            }
            userService.deleteUserById(id);
            return ResponseEntity.ok("Usuario eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el usuario: " + e.getMessage());
        }
    }

    /**
     * Método helper para convertir User a UsuarioResponseDto
     */
    private UsuarioResponseDto convertirADto(User usuario) {
        return new UsuarioResponseDto(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol(),
                usuario.getEstado(),
                usuario.getFechaCreacion(),
                usuario.getFechaActualizacion()
        );
    }
}
