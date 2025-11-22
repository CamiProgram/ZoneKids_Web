package com.zonekids.springboot.api.zonekidsBackend.controllers;

import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
import com.zonekids.springboot.api.zonekidsBackend.services.ProductoServices;
import com.zonekids.springboot.api.zonekidsBackend.services.StorageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductoController {

    @Autowired
    private ProductoServices productoServices;

    @Autowired
    private StorageService storageService;

    @GetMapping
    public List<Producto> getAllProducts() {
        return productoServices.findAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductById(@PathVariable Long id) {
        return productoServices.findProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Producto> createProduct(
            @Valid @RequestPart("product") Producto product,
            @RequestPart("file") MultipartFile file) {
        
        String filename = storageService.store(file);
        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(filename)
                .toUriString();
        
        product.setImagenUrl(imageUrl);
        Producto savedProduct = productoServices.saveProduct(product);
        
        return ResponseEntity.status(201).body(savedProduct);
    }

     @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestPart("product") Producto productDetails,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        return productoServices.findProductById(id)
                .map(product -> {
                    product.setNombre(productDetails.getNombre());
                    product.setDescripcion(productDetails.getDescripcion());
                    product.setPrecio(productDetails.getPrecio());
                    product.setStock(productDetails.getStock());
                    product.setCategoria(productDetails.getCategoria());
                    product.setEstado(productDetails.getEstado());

                    if (file != null && !file.isEmpty()) {
                        String filename = storageService.store(file);
                        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                                .path("/uploads/")
                                .path(filename)
                                .toUriString();
                        product.setImagenUrl(imageUrl);
                    }
                    
                    return ResponseEntity.ok(productoServices.saveProduct(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProduct(@PathVariable Long id) {
        return productoServices.findProductById(id)
                .map(product -> {
                    productoServices.deleteProductById(id);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}