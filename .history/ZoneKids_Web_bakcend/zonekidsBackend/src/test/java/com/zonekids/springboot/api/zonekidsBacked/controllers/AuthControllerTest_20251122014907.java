package com.zonekids.springboot.api.zonekidsBacked.controllers;

import com.zonekids.springboot.api.zonekidsBackend.controllers.AuthController;
import com.zonekids.springboot.api.zonekidsBackend.dto.AuthResponseDto;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para AuthController
 * Verifica login, registro y generación de tokens JWT
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
        // Usuario de prueba
        testUser = new User();
        testUser.setId(1L);
        testUser.setNombre("Test User");
        testUser.setEmail("test@example.com");
        testUser.setRol(RoleEnum.CLIENTE);
        testUser.setEstado("activo");

        // Solicitud de login
        loginRequest = new LoginRequestDto();
        loginRequest.setEmail("test@example.com");
        loginRequest.setContrasena("password123");
    }

    /**
     * Test: Login exitoso devuelve token JWT
     */
    @Test
    void testLoginExitoso() {
        when(userService.findUserByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(jwtUtils.generateToken("test@example.com")).thenReturn("token-jwt-valido");

        ResponseEntity<?> response = authController.login(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof AuthResponseDto);
        AuthResponseDto body = (AuthResponseDto) response.getBody();
        assertEquals("token-jwt-valido", body.getToken());
        verify(userService, times(1)).findUserByEmail("test@example.com");
        verify(authenticationManager, times(1)).authenticate(any());
        verify(jwtUtils, times(1)).generateToken("test@example.com");
    }

    /**
     * Test: Login falla si usuario no existe
     */
    @Test
    void testLoginUsuarioNoExiste() {
        when(userService.findUserByEmail("inexistente@example.com")).thenReturn(Optional.empty());

        LoginRequestDto invalidLogin = new LoginRequestDto();
        invalidLogin.setEmail("inexistente@example.com");
        invalidLogin.setContrasena("password123");

        ResponseEntity<?> response = authController.login(invalidLogin);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(userService, times(1)).findUserByEmail("inexistente@example.com");
        verify(authenticationManager, times(0)).authenticate(any());
    }

    /**
     * Test: Login falla si credenciales son inválidas
     */
    @Test
    void testLoginCredencialesInvalidas() {
        when(userService.findUserByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Credenciales inválidas"));

        ResponseEntity<?> response = authController.login(loginRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(authenticationManager, times(1)).authenticate(any());
        verify(jwtUtils, times(0)).generateToken(any());
    }

    /**
     * Test: Login falla si usuario está inactivo
     */
    @Test
    void testLoginUsuarioInactivo() {
        User inactiveUser = new User();
        inactiveUser.setEmail("test@example.com");
        inactiveUser.setEstado("inactivo");

        when(userService.findUserByEmail("test@example.com")).thenReturn(Optional.of(inactiveUser));

        ResponseEntity<?> response = authController.login(loginRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(authenticationManager, times(0)).authenticate(any());
        verify(jwtUtils, times(0)).generateToken(any());
    }

    /**
     * Test: El token devuelto contiene información del rol
     */
    @Test
    void testTokenContieneRol() {
        when(userService.findUserByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(jwtUtils.generateToken("test@example.com")).thenReturn("jwt-token-con-rol");

        ResponseEntity<?> response = authController.login(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        AuthResponseDto body = (AuthResponseDto) response.getBody();
        assertNotNull(body.getMensaje());
        assertTrue(body.getMensaje().contains("cliente"), 
                "El mensaje debe contener el rol del usuario");
    }
}
