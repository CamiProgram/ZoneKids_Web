package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.dto.ApiResponse;
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

import java.util.HashMap;
import java.util.Map;
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
     * @return Token JWT en ApiResponse
     */
    @PostMapping("/login")
    @Operation(summary = "Login", description = "Autentica un usuario y devuelve un token JWT")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        try {
            System.out.println("🔐 Login intentado con email: " + loginRequest.getEmail());
            
            // Validar que el usuario existe y está activo
            Optional<User> userOptional = userService.findUserByEmail(loginRequest.getEmail());
            if (userOptional.isEmpty()) {
                System.out.println("❌ Usuario no encontrado: " + loginRequest.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Email o contraseña incorrectos"));
            }

            User user = userOptional.get();
            if (!user.getEstado().equals("activo")) {
                System.out.println("❌ Usuario inactivo: " + loginRequest.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Usuario inactivo"));
            }

            // Autenticar el usuario usando AuthenticationManager
            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getEmail(),
                                loginRequest.getContrasena()
                        )
                );
            } catch (BadCredentialsException e) {
                System.out.println("❌ Contraseña incorrecta para: " + loginRequest.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Email o contraseña incorrectos"));
            }

            // Generar el token JWT
            String token = jwtUtils.generateToken(loginRequest.getEmail());
            System.out.println("✅ Login exitoso para: " + loginRequest.getEmail());

            // Retornar la respuesta con el token y rol
            Map<String, Object> loginData = new HashMap<>();
            loginData.put("token", token);
            loginData.put("email", user.getEmail());
            loginData.put("id", user.getId());
            loginData.put("nombre", user.getNombre());
            loginData.put("rol", user.getRol().toString());
            loginData.put("activo", user.getEstado().equals("activo"));

            return ResponseEntity.ok(ApiResponse.success("Login exitoso", loginData));

        } catch (Exception e) {
            System.out.println("❌ Error en login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error en el servidor: " + e.getMessage()));
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
            System.out.println("📝 Registro intentado con email: " + usuarioRequest.getEmail());
            
            // Verificar que el email no esté registrado
            if (userService.findUserByEmail(usuarioRequest.getEmail()).isPresent()) {
                System.out.println("❌ Email ya registrado: " + usuarioRequest.getEmail());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("El email ya está registrado"));
            }

            // Crear nuevo usuario
            User newUser = new User();
            newUser.setNombre(usuarioRequest.getNombre());
            newUser.setEmail(usuarioRequest.getEmail());
            newUser.setContrasena(usuarioRequest.getContrasena());
            
            // Asignar rol CLIENTE por defecto
            newUser.setRol(RoleEnum.CLIENTE);
            newUser.setEstado("activo");

            // Guardar el usuario
            User savedUser = userService.saveUser(newUser);
            System.out.println("✅ Usuario registrado: " + savedUser.getEmail() + " (ID: " + savedUser.getId() + ")");

            // Convertir a DTO de respuesta
            UsuarioResponseDto response = new UsuarioResponseDto();
            response.setId(savedUser.getId());
            response.setNombre(savedUser.getNombre());
            response.setEmail(savedUser.getEmail());
            response.setRol(savedUser.getRol());
            response.setEstado(savedUser.getEstado());
            response.setFechaCreacion(savedUser.getFechaCreacion());
            response.setFechaActualizacion(savedUser.getFechaActualizacion());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Registro exitoso", response));

        } catch (Exception e) {
            System.out.println("❌ Error en registro: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al registrar el usuario: " + e.getMessage()));
        }
    }
}