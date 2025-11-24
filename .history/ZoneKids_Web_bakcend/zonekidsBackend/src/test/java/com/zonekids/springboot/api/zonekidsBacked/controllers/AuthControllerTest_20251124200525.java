package com.zonekids.springboot.api.zonekidsBacked.controllers;

import com.zonekids.springboot.api.zonekidsBackend.controllers.AuthController;
import com.zonekids.springboot.api.zonekidsBackend.dto.LoginRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.enums.RoleEnum;
import com.zonekids.springboot.api.zonekidsBackend.security.JwtUtils;
import com.zonekids.springboot.api.zonekidsBackend.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests corregidos para AuthController
 * Verifica login con JWT, AuthenticationManager y rol en token
 */
@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthController authController;

    private User testUser;
    private LoginRequestDto loginRequest;

    @BeforeEach
    void setUp() {
        // Usuario de prueba activo
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
        // Setup: Usuario existe y está activo
        when(userService.findUserByEmail("cliente@zonekids.com")).thenReturn(Optional.of(testUser));
        
        // Setup: AuthenticationManager valida credenciales
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        
        // Setup: JWT genera token con rol
        when(jwtUtils.generateTokenWithRole("cliente@zonekids.com", "CLIENTE"))
                .thenReturn("jwt-token-valido-con-rol");

        var response = authController.login(loginRequest);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        verify(userService, times(1)).findUserByEmail("cliente@zonekids.com");
        verify(authenticationManager, times(1)).authenticate(any());
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

        var response = authController.login(invalidLogin);

        assertEquals(401, response.getStatusCodeValue());
        verify(userService, times(1)).findUserByEmail("inexistente@zonekids.com");
        verify(authenticationManager, times(0)).authenticate(any());
        verify(jwtUtils, times(0)).generateTokenWithRole(any(), any());
    }

    /**
     * Test: Login falla si credenciales son incorrectas
     */
    @Test
    void testLoginCredencialesInvalidas() {
        when(userService.findUserByEmail("cliente@zonekids.com")).thenReturn(Optional.of(testUser));
        
        // AuthenticationManager lanza excepción
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new org.springframework.security.authentication.BadCredentialsException("Bad credentials"));

        LoginRequestDto invalidLogin = new LoginRequestDto();
        invalidLogin.setEmail("cliente@zonekids.com");
        invalidLogin.setContrasena("incorrecta");

        var response = authController.login(invalidLogin);

        assertEquals(401, response.getStatusCodeValue());
        verify(authenticationManager, times(1)).authenticate(any());
        verify(jwtUtils, times(0)).generateTokenWithRole(any(), any());
    }

    /**
     * Test: Login falla si usuario está inactivo
     */
    @Test
    void testLoginUsuarioInactivo() {
        User inactiveUser = new User();
        inactiveUser.setId(2L);
        inactiveUser.setEmail("inactivo@zonekids.com");
        inactiveUser.setContrasena("$2a$10$hashedPassword");
        inactiveUser.setRol(RoleEnum.CLIENTE);
        inactiveUser.setEstado("inactivo");

        when(userService.findUserByEmail("inactivo@zonekids.com")).thenReturn(Optional.of(inactiveUser));

        LoginRequestDto inactiveLogin = new LoginRequestDto();
        inactiveLogin.setEmail("inactivo@zonekids.com");
        inactiveLogin.setContrasena("password123");

        var response = authController.login(inactiveLogin);

        assertEquals(401, response.getStatusCodeValue());
        verify(authenticationManager, times(0)).authenticate(any());
        verify(jwtUtils, times(0)).generateTokenWithRole(any(), any());
    }

    /**
     * Test: Token generado contiene el rol correcto
     */
    @Test
    void testTokenContieneRol() {
        when(userService.findUserByEmail("cliente@zonekids.com")).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(jwtUtils.generateTokenWithRole("cliente@zonekids.com", "CLIENTE"))
                .thenReturn("token-with-CLIENTE-role");

        var response = authController.login(loginRequest);

        assertEquals(200, response.getStatusCodeValue());
        verify(jwtUtils, times(1)).generateTokenWithRole("cliente@zonekids.com", "CLIENTE");
    }
}


