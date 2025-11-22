package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.dto.AuthResponseDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.LoginRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.UsuarioRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.dto.UsuarioResponseDto;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.enums.RoleEnum;
import com.zonekids.springboot.api.zonekidsBackend.security.JwtUtils;
import com.zonekids.springboot.api.zonekidsBackend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Controlador de autenticación y autorización
 * Rutas públicas bajo /api/v1/auth/
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticación", description = "Endpoints para login y registro")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Endpoint de login
     * @param loginRequest DTO con email y contraseña
     * @return Token JWT en AuthResponseDto
     */
    @PostMapping("/login")
    @Operation(summary = "Login", description = "Autentica un usuario y devuelve un token JWT")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        try {
            // Validar que el usuario existe y está activo
            Optional<User> userOptional = userService.findUserByEmail(loginRequest.getEmail());
            if (userOptional.isEmpty() || !userOptional.get().getEstado().equals("activo")) {
                AuthResponseDto response = new AuthResponseDto();
                response.setMensaje("Credenciales inválidas o cuenta deshabilitada");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // Autenticar el usuario usando AuthenticationManager
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getContrasena()
                    )
            );

            // Generar el token JWT
            String token = jwtUtils.generateToken(loginRequest.getEmail());

            // Retornar la respuesta con el token y rol
            User user = userOptional.get();
            AuthResponseDto response = new AuthResponseDto();
            response.setToken(token);
            response.setMensaje("Login exitoso - Rol: " + user.getRol().getDescripcion());
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            AuthResponseDto response = new AuthResponseDto();
            response.setMensaje("Credenciales inválidas");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            AuthResponseDto response = new AuthResponseDto();
            response.setMensaje("Error en el servidor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint de registro
     * @param usuarioRequest DTO con datos del nuevo usuario
     * @return Datos del usuario creado
     */
    @PostMapping("/register")
    @Operation(summary = "Registro", description = "Crea un nuevo usuario con rol CLIENTE por defecto")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UsuarioRequestDto usuarioRequest) {
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
            
            // Asignar rol (por defecto CLIENTE, solo ADMIN puede asignar otros)
            try {
                RoleEnum rol = RoleEnum.fromString(usuarioRequest.getRol());
                newUser.setRol(rol);
            } catch (IllegalArgumentException e) {
                newUser.setRol(RoleEnum.CLIENTE); // Default
            }
            
            newUser.setEstado("activo");

            // Guardar el usuario
            User savedUser = userService.saveUser(newUser);

            // Convertir a DTO de respuesta
            UsuarioResponseDto response = new UsuarioResponseDto(
                    savedUser.getId(),
                    savedUser.getNombre(),
                    savedUser.getEmail(),
                    savedUser.getRol(),
                    savedUser.getEstado(),
                    savedUser.getFechaCreacion(),
                    savedUser.getFechaActualizacion()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar el usuario: " + e.getMessage());
        }
    }
}