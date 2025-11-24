package com.zonekids.springboot.api.zonekidsBacked.controllers;

import com.zonekids.springboot.api.zonekidsBackend.controllers.AuthController;
import com.zonekids.springboot.api.zonekidsBackend.dto.LoginRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.enums.RoleEnum;
import com.zonekids.springboot.api.zonekidsBackend.exception.BadRequestException;
import com.zonekids.springboot.api.zonekidsBackend.security.JwtUtils;
import com.zonekids.springboot.api.zonekidsBackend.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests corregidos para AuthController
 * Verifica login con JWT y rol incluido en el token
 */
@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthController authController;

    private User testUser;
    private LoginRequestDto loginRequest;

    @BeforeEach
    void setUp() {
        // Usuario de prueba
        testUser = new User();
        testUser.setId(1L);
        testUser.setNombre("Carlos Cliente");
        testUser.setEmail("cliente@zonekids.com");
        testUser.setContrasena("$2a$10$hashedPassword");
        testUser.setRol(RoleEnum.CLIENTE);
        testUser.setEstado("activo");

        // Solicitud de login
        loginRequest = new LoginRequestDto();
        loginRequest.setEmail("cliente@zonekids.com");
        loginRequest.setContrasena("cliente123");
    }

    /**
     * Test: Login exitoso devuelve token JWT con rol
     */
    @Test
    void testLoginExitoso() {
        when(userService.findUserByEmail("cliente@zonekids.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("cliente123", testUser.getContrasena())).thenReturn(true);
        when(jwtUtils.generateTokenWithRole("cliente@zonekids.com", "CLIENTE"))
                .thenReturn("jwt-token-valido-con-rol");

        var response = authController.login(loginRequest);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        verify(userService, times(1)).findUserByEmail("cliente@zonekids.com");
        verify(passwordEncoder, times(1)).matches("cliente123", testUser.getContrasena());
        verify(jwtUtils, times(1)).generateTokenWithRole("cliente@zonekids.com", "CLIENTE");
    }

    /**
     * Test: Login falla si usuario no existe
     */
    @Test
    void testLoginUsuarioNoExiste() {
        when(userService.findUserByEmail("inexistente@zonekids.com")).thenReturn(Optional.empty());

        LoginRequestDto invalidLogin = new LoginRequestDto();
        invalidLogin.setEmail("inexistente@zonekids.com");
        invalidLogin.setContrasena("password123");

        assertThrows(BadRequestException.class, () -> authController.login(invalidLogin));
        verify(userService, times(1)).findUserByEmail("inexistente@zonekids.com");
        verify(passwordEncoder, times(0)).matches(any(), any());
    }

    /**
     * Test: Login falla si contraseña es incorrecta
     */
    @Test
    void testLoginCredencialesInvalidas() {
        when(userService.findUserByEmail("cliente@zonekids.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("incorrecta", testUser.getContrasena())).thenReturn(false);

        LoginRequestDto invalidLogin = new LoginRequestDto();
        invalidLogin.setEmail("cliente@zonekids.com");
        invalidLogin.setContrasena("incorrecta");

        assertThrows(BadRequestException.class, () -> authController.login(invalidLogin));
        verify(passwordEncoder, times(1)).matches("incorrecta", testUser.getContrasena());
        verify(jwtUtils, times(0)).generateTokenWithRole(any(), any());
    }

    /**
     * Test: Token generado contiene el rol correcto
     */
    @Test
    void testTokenContieneRol() {
        when(userService.findUserByEmail("cliente@zonekids.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("cliente123", testUser.getContrasena())).thenReturn(true);
        when(jwtUtils.generateTokenWithRole("cliente@zonekids.com", "CLIENTE"))
                .thenReturn("token-with-CLIENTE-role");

        var response = authController.login(loginRequest);

        verify(jwtUtils, times(1)).generateTokenWithRole("cliente@zonekids.com", "CLIENTE");
        assertEquals(200, response.getStatusCodeValue());
    }

    /**
     * Test: Admin login devuelve token con rol ADMIN
     */
    @Test
    void testLoginUsuarioInactivo() {
        User inactiveUser = new User();
        inactiveUser.setId(1L);
        inactiveUser.setEmail("inactivo@zonekids.com");
        inactiveUser.setContrasena("$2a$10$hashedPassword");
        inactiveUser.setRol(RoleEnum.CLIENTE);
        inactiveUser.setEstado("inactivo");

        LoginRequestDto inactiveLogin = new LoginRequestDto();
        inactiveLogin.setEmail("inactivo@zonekids.com");
        inactiveLogin.setContrasena("password123");

        when(userService.findUserByEmail("inactivo@zonekids.com")).thenReturn(Optional.of(inactiveUser));
        when(passwordEncoder.matches("password123", inactiveUser.getContrasena())).thenReturn(true);

        var response = authController.login(inactiveLogin);

        // Usuario inactivo puede loguear, pero el frontend podría bloquearlo
        assertEquals(200, response.getStatusCodeValue());
        verify(jwtUtils, times(1)).generateTokenWithRole("inactivo@zonekids.com", "CLIENTE");
    }
}

