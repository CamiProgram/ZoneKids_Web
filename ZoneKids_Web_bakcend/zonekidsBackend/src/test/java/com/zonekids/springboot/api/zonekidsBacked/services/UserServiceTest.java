package com.zonekids.springboot.api.zonekidsBacked.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.repositories.UserRepository;
import com.zonekids.springboot.api.zonekidsBackend.services.UserServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService; // Asegúrate que el nombre de la clase coincida

    private User user1;
    private User user2;

    @BeforeEach
    void setUp() {
        user1 = new User();
        user1.setId(1L);
        user1.setNombre("Admin Test");
        user1.setEmail("admin@test.com");
        user1.setRol("super-admin");

        user2 = new User();
        user2.setId(2L);
        user2.setNombre("Cliente Test");
        user2.setEmail("cliente@test.com");
        user2.setRol("cliente");
    }

    @Test
    void testFindAllUsers() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        List<User> users = userService.findAllUsers();

        assertNotNull(users);
        assertEquals(2, users.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testFindUserByEmail_Exists() {
        String emailExistente = "admin@test.com";
        when(userRepository.findByEmail(emailExistente)).thenReturn(Optional.of(user1));

        Optional<User> userOpt = userService.findUserByEmail(emailExistente);

        assertTrue(userOpt.isPresent());
        assertEquals(emailExistente, userOpt.get().getEmail());
        verify(userRepository, times(1)).findByEmail(emailExistente);
    }
    
    @Test
    void testSaveUser() {
        User userNuevo = new User();
        userNuevo.setNombre("Nuevo User");
        userNuevo.setEmail("nuevo@test.com");
        userNuevo.setContrasena("pass123");
        userNuevo.setRol("cliente");

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
             User u = invocation.getArgument(0);
             u.setId(3L);
             // Aquí iría la lógica simulada de encriptación si la pruebas
             return u;
        });

        User userGuardado = userService.saveUser(userNuevo);

        assertNotNull(userGuardado);
        assertEquals(3L, userGuardado.getId());
        assertEquals("nuevo@test.com", userGuardado.getEmail());
        // Podrías verificar si la contraseña fue "encriptada" si implementas esa lógica
        verify(userRepository, times(1)).save(userNuevo);
    }
}