package com.zonekids.springboot.api.zonekidsBacked.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
import com.zonekids.springboot.api.zonekidsBackend.repositories.ProductoRepository;
import com.zonekids.springboot.api.zonekidsBackend.services.ProductoServiceImpl;

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

@ExtendWith(MockitoExtension.class) // Habilita las anotaciones de Mockito
class ProductServiceTest {

    @Mock // Crea un objeto falso (mock) del repositorio
    private ProductoRepository productoRepository;

    @InjectMocks // Crea una instancia real del servicio e inyecta los mocks (@Mock)
    private ProductoServiceImpl productoService; // Asegúrate que el nombre de la clase coincida

    private Producto producto1;
    private Producto producto2;

    @BeforeEach // Se ejecuta antes de cada prueba (@Test)
    void setUp() {
        // Preparamos datos de prueba
        producto1 = new Producto();
        producto1.setId(1L);
        producto1.setNombre("Peluche Test");
        producto1.setPrecio(1000.0);
        producto1.setStock(10);

        producto2 = new Producto();
        producto2.setId(2L);
        producto2.setNombre("Juguete Test");
        producto2.setPrecio(2500.0);
        producto2.setStock(5);
    }

    @Test
    void testFindAllProducts() {
        // 1. Define qué debe devolver el mock cuando se llame a su método
        when(productoRepository.findAll()).thenReturn(Arrays.asList(producto1, producto2));

        // 2. Llama al método del servicio que quieres probar
        List<Producto> productos = productoService.findAllProducts();

        // 3. Verifica que el resultado sea el esperado
        assertNotNull(productos);
        assertEquals(2, productos.size());
        assertEquals("Peluche Test", productos.get(0).getNombre());
        // 4. Verifica que el método del mock se llamó una vez
        verify(productoRepository, times(1)).findAll();
    }

    @Test
    void testFindProductById_Exists() {
        Long idExistente = 1L;
        // Define qué devuelve el mock
        when(productoRepository.findById(idExistente)).thenReturn(Optional.of(producto1));

        // Llama al servicio
        Optional<Producto> productoOpt = productoService.findProductById(idExistente);

        // Verifica
        assertTrue(productoOpt.isPresent());
        assertEquals(idExistente, productoOpt.get().getId());
        verify(productoRepository, times(1)).findById(idExistente);
    }

    @Test
    void testFindProductById_NotExists() {
        Long idInexistente = 99L;
        // Define qué devuelve el mock (Optional vacío)
        when(productoRepository.findById(idInexistente)).thenReturn(Optional.empty());

        // Llama al servicio
        Optional<Producto> productoOpt = productoService.findProductById(idInexistente);

        // Verifica
        assertTrue(productoOpt.isEmpty());
        verify(productoRepository, times(1)).findById(idInexistente);
    }

    @Test
    void testSaveProduct() {
        Producto productoNuevo = new Producto();
        productoNuevo.setNombre("Producto Nuevo");
        productoNuevo.setPrecio(500.0);

        // Define qué devuelve el mock al guardar (usualmente el mismo objeto con ID)
        when(productoRepository.save(any(Producto.class))).thenAnswer(invocation -> {
            Producto p = invocation.getArgument(0);
            p.setId(3L); // Simula que la BD le asigna un ID
            return p;
        });

        // Llama al servicio
        Producto productoGuardado = productoService.saveProduct(productoNuevo);

        // Verifica
        assertNotNull(productoGuardado);
        assertEquals(3L, productoGuardado.getId());
        assertEquals("Producto Nuevo", productoGuardado.getNombre());
        verify(productoRepository, times(1)).save(productoNuevo);
    }

    @Test
    void testDeleteProductById() {
        Long idABorrar = 1L;
        // No necesitas 'when' para métodos void, solo verificar que se llamen
        
        // Llama al servicio
        productoService.deleteProductById(idABorrar);

        // Verifica que el método deleteById del repositorio se llamó una vez con el ID correcto
        verify(productoRepository, times(1)).deleteById(idABorrar);
    }

    @Test
    void testUpdateProductStock() {
        // Preparar
        Long productoId = 1L;
        int nuevoStock = 15;
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto1));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto1);

        // Ejecutar
        producto1.setStock(nuevoStock);
        Producto productoActualizado = productoService.saveProduct(producto1);

        // Verificar
        assertNotNull(productoActualizado);
        assertEquals(nuevoStock, productoActualizado.getStock());
        verify(productoRepository).save(producto1);
    }

    @Test
    void testUpdateProductPrice() {
        // Preparar
        Long productoId = 1L;
        double nuevoPrecio = 1500.0;
        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto1));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto1);

        // Ejecutar
        producto1.setPrecio(nuevoPrecio);
        Producto productoActualizado = productoService.saveProduct(producto1);

        // Verificar
        assertNotNull(productoActualizado);
        assertEquals(nuevoPrecio, productoActualizado.getPrecio());
        verify(productoRepository).save(producto1);
    }

    @Test
    void testProductListIsEmpty() {
        // Preparar
        when(productoRepository.findAll()).thenReturn(Arrays.asList());

        // Ejecutar
        List<Producto> productos = productoService.findAllProducts();

        // Verificar
        assertNotNull(productos);
        assertTrue(productos.isEmpty());
        verify(productoRepository).findAll();
    }

    @Test
    void testProductHasValidPriceAndStock() {
        // Preparar
        Producto productoTest = new Producto();
        productoTest.setNombre("Test Validación");
        productoTest.setPrecio(-100.0); // Precio inválido
        productoTest.setStock(-5); // Stock inválido

        // Verificar que se lanzan excepciones por valores inválidos
        assertThrows(IllegalArgumentException.class, () -> {
            productoService.saveProduct(productoTest);
        });
    }
}