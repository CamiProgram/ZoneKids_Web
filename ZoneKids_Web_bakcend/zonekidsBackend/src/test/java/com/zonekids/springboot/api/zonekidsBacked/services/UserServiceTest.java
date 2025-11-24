package com.zonekids.springboot.api.zonekidsBacked.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.enums.RoleEnum;
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

/**
 * Tests unitarios para UserServiceImpl
 * Verifica la lógica de negocio del servicio de usuarios
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User adminUser;
    private User clienteUser;
    private User vendedorUser;

    @BeforeEach
    void setUp() {
        // Usuario ADMIN
        adminUser = new User();
        adminUser.setId(1L);
        adminUser.setNombre("Admin Test");
        adminUser.setEmail("admin@test.com");
        adminUser.setRol(RoleEnum.ADMIN);
        adminUser.setEstado("activo");

        // Usuario CLIENTE
        clienteUser = new User();
        clienteUser.setId(2L);
        clienteUser.setNombre("Cliente Test");
        clienteUser.setEmail("cliente@test.com");
        clienteUser.setRol(RoleEnum.CLIENTE);
        clienteUser.setEstado("activo");

        // Usuario VENDEDOR
        vendedorUser = new User();
        vendedorUser.setId(3L);
        vendedorUser.setNombre("Vendedor Test");
        vendedorUser.setEmail("vendedor@test.com");
        vendedorUser.setRol(RoleEnum.VENDEDOR);
        vendedorUser.setEstado("activo");
    }

    /**
     * Test: Obtener todos los usuarios
     */
    @Test
    void testFindAllUsers() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(adminUser, clienteUser, vendedorUser));

        List<User> users = userService.findAllUsers();

        assertNotNull(users);
        assertEquals(3, users.size());
        verify(userRepository, times(1)).findAll();
    }

    /**
     * Test: Obtener usuario por email existente
     */
    @Test
    void testFindUserByEmail_Exists() {
        String email = "admin@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(adminUser));

        Optional<User> userOpt = userService.findUserByEmail(email);

        assertTrue(userOpt.isPresent());
        assertEquals(email, userOpt.get().getEmail());
        assertEquals(RoleEnum.ADMIN, userOpt.get().getRol());
        verify(userRepository, times(1)).findByEmail(email);
    }

    /**
     * Test: Obtener usuario por email no existente
     */
    @Test
    void testFindUserByEmail_NotExists() {
        String email = "inexistente@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        Optional<User> userOpt = userService.findUserByEmail(email);

        assertFalse(userOpt.isPresent());
        verify(userRepository, times(1)).findByEmail(email);
    }

    /**
     * Test: Guardar un nuevo usuario
     */
    @Test
    void testSaveUser() {
        User userNuevo = new User();
        userNuevo.setNombre("Nuevo Usuario");
        userNuevo.setEmail("nuevo@test.com");
        userNuevo.setContrasena("password123");
        userNuevo.setRol(RoleEnum.CLIENTE);
        userNuevo.setEstado("activo");

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(4L);
            return u;
        });

        User userGuardado = userService.saveUser(userNuevo);

        assertNotNull(userGuardado);
        assertEquals(4L, userGuardado.getId());
        assertEquals("nuevo@test.com", userGuardado.getEmail());
        assertEquals(RoleEnum.CLIENTE, userGuardado.getRol());
        verify(userRepository, times(1)).save(userNuevo);
    }

    /**
     * Test: Obtener usuario por ID
     */
    @Test
    void testFindUserById() {
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.of(adminUser));

        Optional<User> userOpt = userService.findUserById(userId);

        assertTrue(userOpt.isPresent());
        assertEquals(userId, userOpt.get().getId());
        assertEquals(RoleEnum.ADMIN, userOpt.get().getRol());
        verify(userRepository, times(1)).findById(userId);
    }

    /**
     * Test: Eliminar usuario por ID
     */
    @Test
    void testDeleteUserById() {
        Long userId = 2L;

        userService.deleteUserById(userId);

        verify(userRepository, times(1)).deleteById(userId);
    }

    /**
     * Test: Verificar que usuario ADMIN tiene el rol correcto
     */
    @Test
    void testUserAdminRole() {
        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(adminUser));

        Optional<User> userOpt = userService.findUserByEmail("admin@test.com");

        assertTrue(userOpt.isPresent());
        assertEquals(RoleEnum.ADMIN, userOpt.get().getRol());
        assertEquals(RoleEnum.ADMIN.getValor(), userOpt.get().getRol().getValor(), "Rol debe ser ADMIN");
    }

    /**
     * Test: Verificar que usuario inactivo no puede acceder
     */
    @Test
    void testInactiveUserState() {
        User inactiveUser = new User();
        inactiveUser.setId(99L);
        inactiveUser.setEmail("inactivo@test.com");
        inactiveUser.setEstado("inactivo");

        when(userRepository.findByEmail("inactivo@test.com")).thenReturn(Optional.of(inactiveUser));

        Optional<User> userOpt = userService.findUserByEmail("inactivo@test.com");

        assertTrue(userOpt.isPresent());
        assertEquals("inactivo", userOpt.get().getEstado());
    }
}