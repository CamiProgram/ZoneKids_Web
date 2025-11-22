package com.zonekids.springboot.api.zonekidsBackend.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
import java.util.List;
import java.util.Optional;

public interface ProductoServices {
    List<Producto> findAllProducts();
    Optional<Producto> findProductById(Long id);
    Producto saveProduct(Producto product); // Para crear y actualizar
    void deleteProductById(Long id);
}