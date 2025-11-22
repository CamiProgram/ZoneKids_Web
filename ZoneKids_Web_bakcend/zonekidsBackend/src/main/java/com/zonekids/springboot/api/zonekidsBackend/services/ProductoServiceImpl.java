package com.zonekids.springboot.api.zonekidsBackend.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
import com.zonekids.springboot.api.zonekidsBackend.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImpl implements ProductoServices {

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public List<Producto> findAllProducts() {
        return productoRepository.findAll();
    }

    @Override
    public Optional<Producto> findProductById(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    public Producto saveProduct(Producto product) {
        // Aquí podrías añadir lógica de negocio antes de guardar, si fuera necesario
        return productoRepository.save(product);
    }

    @Override
    public void deleteProductById(Long id) {
        productoRepository.deleteById(id);
    }
}