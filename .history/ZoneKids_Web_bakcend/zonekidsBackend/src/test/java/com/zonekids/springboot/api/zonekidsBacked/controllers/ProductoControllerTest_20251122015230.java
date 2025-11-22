package com.zonekids.springboot.api.zonekidsBacked.controllers;

import com.zonekids.springboot.api.zonekidsBackend.controllers.ProductoController;
import com.zonekids.springboot.api.zonekidsBackend.dto.ProductoRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
import com.zonekids.springboot.api.zonekidsBackend.services.ProductoServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para ProductoController
 * Verifica CRUD de productos con validación de roles y imágenes
 */
@ExtendWith(MockitoExtension.class)
class ProductoControllerTest {

    @Mock
    private ProductoServices productoServices;

    @InjectMocks
    private ProductoController productoController;

    private Producto testProducto;
    private ProductoRequestDto productoRequest;

    @BeforeEach
    void setUp() {
        // Producto de prueba
        testProducto = new Producto();
        testProducto.setId(1L);
        testProducto.setNombre("Peluche Prueba");
        testProducto.setPrecio(500.0);
        testProducto.setStock(10);
        testProducto.setCategoria("Peluches");
        testProducto.setEstado("activo");
        
        // 2 imágenes (mínimo)
        List<String> imagenes = new ArrayList<>();
        imagenes.add("imagen1.jpg");
        imagenes.add("imagen2.jpg");
        testProducto.setImagenesUrl(imagenes);

        // DTO de solicitud
        productoRequest = new ProductoRequestDto();
        productoRequest.setNombre("Nuevo Producto");
        productoRequest.setPrecio(1000.0);
        productoRequest.setStock(5);
        productoRequest.setCategoria("Juguetes");
        productoRequest.setImagenesUrl(imagenes);
    }

    /**
     * Test: Obtener todos los productos
     */
    @Test
    void testObtenerTodos() {
        List<Producto> productos = Arrays.asList(testProducto);
        when(productoServices.findAllProducts()).thenReturn(productos);

        ResponseEntity<?> response = productoController.obtenerTodos();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(productoServices, times(1)).findAllProducts();
    }

    /**
     * Test: Obtener producto por ID existente
     */
    @Test
    void testObtenerPorId_Existe() {
        when(productoServices.findProductById(1L)).thenReturn(Optional.of(testProducto));

        ResponseEntity<?> response = productoController.obtenerPorId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(productoServices, times(1)).findProductById(1L);
    }

    /**
     * Test: Obtener producto por ID que no existe
     */
    @Test
    void testObtenerPorId_NoExiste() {
        when(productoServices.findProductById(99L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = productoController.obtenerPorId(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(productoServices, times(1)).findProductById(99L);
    }

    /**
     * Test: Crear producto con 2 imágenes (válido)
     */
    @Test
    void testCrearProducto_ConDosCImagenes() {
        when(productoServices.guardar(any(Producto.class))).thenReturn(testProducto);

        ResponseEntity<?> response = productoController.crear(productoRequest);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(productoServices, times(1)).guardar(any(Producto.class));
    }

    /**
     * Test: Crear producto con 3 imágenes (válido)
     */
    @Test
    void testCrearProducto_ConTresImagenes() {
        List<String> tresImagenes = new ArrayList<>();
        tresImagenes.add("img1.jpg");
        tresImagenes.add("img2.jpg");
        tresImagenes.add("img3.jpg");
        productoRequest.setImagenesUrl(tresImagenes);

        when(productoServices.guardar(any(Producto.class))).thenReturn(testProducto);

        ResponseEntity<?> response = productoController.crear(productoRequest);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(productoServices, times(1)).guardar(any(Producto.class));
    }

    /**
     * Test: Crear producto sin imágenes (inválido)
     */
    @Test
    void testCrearProducto_SinImagenes() {
        productoRequest.setImagenesUrl(new ArrayList<>());

        ResponseEntity<?> response = productoController.crear(productoRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("mínimo"));
        verify(productoServices, times(0)).guardar(any(Producto.class));
    }

    /**
     * Test: Crear producto con 1 imagen (inválido)
     */
    @Test
    void testCrearProducto_UnaImagen() {
        List<String> unaImagen = new ArrayList<>();
        unaImagen.add("img1.jpg");
        productoRequest.setImagenesUrl(unaImagen);

        ResponseEntity<?> response = productoController.crear(productoRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(productoServices, times(0)).guardar(any(Producto.class));
    }

    /**
     * Test: Crear producto con 4 imágenes (inválido)
     */
    @Test
    void testCrearProducto_CuatroImagenes() {
        List<String> cuatroImagenes = new ArrayList<>();
        cuatroImagenes.add("img1.jpg");
        cuatroImagenes.add("img2.jpg");
        cuatroImagenes.add("img3.jpg");
        cuatroImagenes.add("img4.jpg");
        productoRequest.setImagenesUrl(cuatroImagenes);

        ResponseEntity<?> response = productoController.crear(productoRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(productoServices, times(0)).guardar(any(Producto.class));
    }

    /**
     * Test: Actualizar producto
     */
    @Test
    void testActualizarProducto() {
        when(productoServices.obtenerPorId(1L)).thenReturn(Optional.of(testProducto));
        when(productoServices.guardar(any(Producto.class))).thenReturn(testProducto);

        ResponseEntity<?> response = productoController.actualizar(1L, productoRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(productoServices, times(1)).obtenerPorId(1L);
        verify(productoServices, times(1)).guardar(any(Producto.class));
    }

    /**
     * Test: Eliminar producto
     */
    @Test
    void testEliminarProducto() {
        when(productoServices.obtenerPorId(1L)).thenReturn(Optional.of(testProducto));

        ResponseEntity<?> response = productoController.eliminar(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(productoServices, times(1)).obtenerPorId(1L);
        verify(productoServices, times(1)).eliminar(1L);
    }

    /**
     * Test: Intentar eliminar producto que no existe
     */
    @Test
    void testEliminarProducto_NoExiste() {
        when(productoServices.obtenerPorId(99L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = productoController.eliminar(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(productoServices, times(0)).eliminar(any());
    }
}
