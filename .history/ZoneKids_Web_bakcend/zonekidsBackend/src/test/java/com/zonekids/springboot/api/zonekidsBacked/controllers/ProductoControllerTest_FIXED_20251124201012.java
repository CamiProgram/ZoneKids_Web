package com.zonekids.springboot.api.zonekidsBacked.controllers;

import com.zonekids.springboot.api.zonekidsBackend.controllers.ProductoController;
import com.zonekids.springboot.api.zonekidsBackend.dto.ProductoRequestDto;
import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
import com.zonekids.springboot.api.zonekidsBackend.exception.ResourceNotFoundException;
import com.zonekids.springboot.api.zonekidsBackend.services.ProductoServices;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests corregidos para ProductoController
 * Verifica CRUD con validación de 2-3 imágenes
 */
@ExtendWith(MockitoExtension.class)
class ProductoControllerTest_FIXED {

    @Mock
    private ProductoServices productoServices;

    @InjectMocks
    private ProductoController productoController;

    private Producto testProducto;
    private ProductoRequestDto productoRequest;

    @BeforeEach
    void setUp() {
        // Producto de prueba con 2 imágenes
        testProducto = new Producto();
        testProducto.setId(1L);
        testProducto.setNombre("Body Manga Larga Blanco");
        testProducto.setDescripcion("Body de algodón para bebé");
        testProducto.setPrecio(2900.0);
        testProducto.setStock(50);
        testProducto.setCategoria("Bodys");
        testProducto.setEstado("activo");
        testProducto.setEsNuevo(true);
        testProducto.setEnOferta(false);
        
        // 2 imágenes (mínimo válido)
        List<String> imagenes = new ArrayList<>();
        imagenes.add("/uploads/body_frente.jpg");
        imagenes.add("/uploads/body_espalda.jpg");
        testProducto.setImagenesUrl(imagenes);

        // DTO de solicitud
        productoRequest = new ProductoRequestDto();
        productoRequest.setNombre("Body Manga Larga Blanco");
        productoRequest.setDescripcion("Body de algodón para bebé");
        productoRequest.setPrecio(2900L);
        productoRequest.setStock(50);
        productoRequest.setCategoria("Bodys");
        productoRequest.setImagenesUrl(imagenes);
        productoRequest.setEsNuevo(true);
        productoRequest.setEnOferta(false);
    }

    /**
     * Test: Obtener todos los productos
     */
    @Test
    void testObtenerTodos() {
        List<Producto> productos = Arrays.asList(testProducto);
        when(productoServices.findAllProducts()).thenReturn(productos);

        var response = productoController.obtenerTodos();

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        verify(productoServices, times(1)).findAllProducts();
    }

    /**
     * Test: Obtener producto por ID existente
     */
    @Test
    void testObtenerPorId_Existe() {
        when(productoServices.findProductById(1L)).thenReturn(Optional.of(testProducto));

        var response = productoController.obtenerPorId(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        verify(productoServices, times(1)).findProductById(1L);
    }

    /**
     * Test: Obtener producto por ID que no existe
     */
    @Test
    void testObtenerPorId_NoExiste() {
        when(productoServices.findProductById(99L)).thenReturn(Optional.empty());

        var response = productoController.obtenerPorId(99L);

        assertEquals(404, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        verify(productoServices, times(1)).findProductById(99L);
    }

    /**
     * Test: Crear producto con 2 imágenes (válido)
     */
    @Test
    void testCrearProducto_ConDosImagenes() {
        when(productoServices.saveProduct(any(Producto.class))).thenReturn(testProducto);

        var response = productoController.crear(productoRequest);

        assertEquals(201, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        verify(productoServices, times(1)).saveProduct(any(Producto.class));
    }

    /**
     * Test: Crear producto con 3 imágenes (válido)
     */
    @Test
    void testCrearProducto_ConTresImagenes() {
        List<String> tresImagenes = new ArrayList<>();
        tresImagenes.add("/uploads/img1.jpg");
        tresImagenes.add("/uploads/img2.jpg");
        tresImagenes.add("/uploads/img3.jpg");
        productoRequest.setImagenesUrl(tresImagenes);
        
        Producto productoConTres = new Producto();
        productoConTres.setImagenesUrl(tresImagenes);

        when(productoServices.saveProduct(any(Producto.class))).thenReturn(productoConTres);

        var response = productoController.crear(productoRequest);

        assertEquals(201, response.getStatusCodeValue());
        verify(productoServices, times(1)).saveProduct(any(Producto.class));
    }

    /**
     * Test: Actualizar producto
     */
    @Test
    void testActualizarProducto() {
        when(productoServices.findProductById(1L)).thenReturn(Optional.of(testProducto));
        when(productoServices.saveProduct(any(Producto.class))).thenReturn(testProducto);

        var response = productoController.actualizar(1L, productoRequest);

        assertEquals(200, response.getStatusCodeValue());
        verify(productoServices, times(1)).findProductById(1L);
        verify(productoServices, times(1)).saveProduct(any(Producto.class));
    }

    /**
     * Test: Actualizar producto que no existe
     */
    @Test
    void testActualizarProducto_NoExiste() {
        when(productoServices.findProductById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productoController.actualizar(99L, productoRequest));
        verify(productoServices, times(1)).findProductById(99L);
        verify(productoServices, times(0)).saveProduct(any());
    }

    /**
     * Test: Eliminar producto
     */
    @Test
    void testEliminarProducto() {
        when(productoServices.findProductById(1L)).thenReturn(Optional.of(testProducto));

        var response = productoController.eliminar(1L);

        assertEquals(200, response.getStatusCodeValue());
        verify(productoServices, times(1)).findProductById(1L);
        verify(productoServices, times(1)).deleteProductById(1L);
    }

    /**
     * Test: Intentar eliminar producto que no existe
     */
    @Test
    void testEliminarProducto_NoExiste() {
        when(productoServices.findProductById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productoController.eliminar(99L));
        verify(productoServices, times(0)).deleteProductById(any());
    }

    /**
     * Test: Validar precio conversion (Long a Double)
     */
    @Test
    void testPrecioConversion() {
        productoRequest.setPrecio(2900L);
        when(productoServices.saveProduct(any(Producto.class))).thenReturn(testProducto);

        var response = productoController.crear(productoRequest);

        assertEquals(201, response.getStatusCodeValue());
        verify(productoServices, times(1)).saveProduct(any(Producto.class));
    }
}
