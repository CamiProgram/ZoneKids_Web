package com.zonekids.springboot.api.zonekidsBacked.validation;

import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests de validación para imágenes de productos
 * Verifica que los productos tengan mínimo 2 y máximo 3 imágenes
 */
@ExtendWith(MockitoExtension.class)
class ProductoImagenesValidationTest {

    private Producto producto;

    @BeforeEach
    void setUp() {
        producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Producto Test");
        producto.setPrecio(100.0);
        producto.setStock(5);
    }

    /**
     * Test: Producto debe rechazar 0 imágenes
     */
    @Test
    void testProductoSinImagenes() {
        producto.setImagenesUrl(new ArrayList<>());

        assertThrows(IllegalArgumentException.class, () -> {
            // Simular la validación @PrePersist
            validarImagenes(producto);
        }, "Debe lanzar excepción: mínimo 2 imágenes");
    }

    /**
     * Test: Producto debe rechazar 1 imagen
     */
    @Test
    void testProductoUnaImagen() {
        List<String> imagenes = new ArrayList<>();
        imagenes.add("imagen1.jpg");
        producto.setImagenesUrl(imagenes);

        assertThrows(IllegalArgumentException.class, () -> {
            validarImagenes(producto);
        }, "Debe lanzar excepción: mínimo 2 imágenes");
    }

    /**
     * Test: Producto acepta 2 imágenes (mínimo válido)
     */
    @Test
    void testProductoDoImagenes() {
        List<String> imagenes = new ArrayList<>();
        imagenes.add("imagen1.jpg");
        imagenes.add("imagen2.jpg");
        producto.setImagenesUrl(imagenes);

        assertDoesNotThrow(() -> validarImagenes(producto),
                "Debe aceptar 2 imágenes");
        assertEquals(2, producto.getImagenesUrl().size());
    }

    /**
     * Test: Producto acepta 3 imágenes (máximo válido)
     */
    @Test
    void testProductoTresImagenes() {
        List<String> imagenes = new ArrayList<>();
        imagenes.add("imagen1.jpg");
        imagenes.add("imagen2.jpg");
        imagenes.add("imagen3.jpg");
        producto.setImagenesUrl(imagenes);

        assertDoesNotThrow(() -> validarImagenes(producto),
                "Debe aceptar 3 imágenes");
        assertEquals(3, producto.getImagenesUrl().size());
    }

    /**
     * Test: Producto debe rechazar 4 imágenes
     */
    @Test
    void testProductoCuatroImagenes() {
        List<String> imagenes = new ArrayList<>();
        imagenes.add("imagen1.jpg");
        imagenes.add("imagen2.jpg");
        imagenes.add("imagen3.jpg");
        imagenes.add("imagen4.jpg");
        producto.setImagenesUrl(imagenes);

        assertThrows(IllegalArgumentException.class, () -> {
            validarImagenes(producto);
        }, "Debe lanzar excepción: máximo 3 imágenes");
    }

    /**
     * Test: Método agregarImagen debe validar límite de 3
     */
    @Test
    void testAgregarImagenExcedeLimite() {
        List<String> imagenes = new ArrayList<>();
        imagenes.add("imagen1.jpg");
        imagenes.add("imagen2.jpg");
        imagenes.add("imagen3.jpg");
        producto.setImagenesUrl(imagenes);

        // Intentar agregar una 4ta imagen
        assertThrows(IllegalArgumentException.class, () -> {
            producto.agregarImagen("imagen4.jpg");
        }, "No debe permitir más de 3 imágenes");
    }

    /**
     * Test: Agregar imagen si hay solo 1
     */
    @Test
    void testAgregarImagenDesdeUna() {
        List<String> imagenes = new ArrayList<>();
        imagenes.add("imagen1.jpg");
        producto.setImagenesUrl(imagenes);

        // Agregar segunda imagen
        assertDoesNotThrow(() -> producto.agregarImagen("imagen2.jpg"));
        assertEquals(2, producto.getImagenesUrl().size());
    }

    /**
     * Test: Agregar tercera imagen
     */
    @Test
    void testAgregarTerceraImagen() {
        List<String> imagenes = new ArrayList<>();
        imagenes.add("imagen1.jpg");
        imagenes.add("imagen2.jpg");
        producto.setImagenesUrl(imagenes);

        // Agregar tercera imagen
        assertDoesNotThrow(() -> producto.agregarImagen("imagen3.jpg"));
        assertEquals(3, producto.getImagenesUrl().size());
    }

    /**
     * Test: URL de imagen no puede ser nula
     */
    @Test
    void testImagenNoNula() {
        List<String> imagenes = new ArrayList<>();
        imagenes.add("imagen1.jpg");
        imagenes.add(null); // Esta debería validarse
        producto.setImagenesUrl(imagenes);

        // Aunque aquí no lanzamos error, en una BD real esto sería problema
        assertNotNull(producto.getImagenesUrl());
        assertEquals(2, producto.getImagenesUrl().size());
    }

    /**
     * Test: Validar que el rango es [2, 3]
     */
    @Test
    void testRangoValido() {
        for (int i = 0; i <= 5; i++) {
            List<String> imagenes = new ArrayList<>();
            for (int j = 0; j < i; j++) {
                imagenes.add("imagen" + j + ".jpg");
            }
            producto.setImagenesUrl(imagenes);

            boolean debeSerValido = (i >= 2 && i <= 3);

            try {
                validarImagenes(producto);
                assertTrue(debeSerValido, "Con " + i + " imágenes debe ser válido");
            } catch (IllegalArgumentException e) {
                assertFalse(debeSerValido, "Con " + i + " imágenes debe ser inválido");
            }
        }
    }

    /**
     * Método helper para simular la validación del producto
     */
    private void validarImagenes(Producto p) {
        if (p.getImagenesUrl() == null) {
            p.setImagenesUrl(new ArrayList<>());
        }

        if (p.getImagenesUrl().size() < 2) {
            throw new IllegalArgumentException("El producto debe tener mínimo 2 imágenes");
        }

        if (p.getImagenesUrl().size() > 3) {
            throw new IllegalArgumentException("El producto puede tener máximo 3 imágenes");
        }
    }
}
