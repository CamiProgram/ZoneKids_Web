package com.zonekids.springboot.api.zonekidsBackend.services;

import com.zonekids.springboot.api.zonekidsBackend.entities.Orden;
import com.zonekids.springboot.api.zonekidsBackend.entities.DetalleOrden;
import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.repositories.OrdenRepository;
import com.zonekids.springboot.api.zonekidsBackend.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Implementación del servicio de órdenes
 * Gestiona la creación de órdenes y el descuento de stock
 */
@Service
public class OrdenServiceImpl implements OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Override
    public List<Orden> obtenerTodas() {
        return ordenRepository.findAll();
    }

    @Override
    public Optional<Orden> obtenerPorId(Long id) {
        return ordenRepository.findById(id);
    }

    /**
     * Crea una nueva orden y descuenta el stock de los productos
     * Usa @Transactional para asegurar que todo se guarde o se revierta
     */
    @Override
    @Transactional
    public Orden crear(Orden orden) {
        // Validar y descontar stock para cada detalle
        for (DetalleOrden detalle : orden.getDetalles()) {
            Producto producto = detalle.getProducto();
            Integer cantidadSolicitada = detalle.getCantidad();
            
            // Verificar que hay stock disponible
            if (producto.getStock() < cantidadSolicitada) {
                throw new IllegalArgumentException(
                    "Stock insuficiente para el producto: " + producto.getNombre() + 
                    ". Stock disponible: " + producto.getStock() + 
                    ", Cantidad solicitada: " + cantidadSolicitada
                );
            }
            
            // Descontar el stock
            producto.setStock(producto.getStock() - cantidadSolicitada);
            productoRepository.save(producto);
        }
        
        // Calcular y guardar la orden
        orden.actualizarTotal();
        return ordenRepository.save(orden);
    }

    @Override
    public Orden actualizar(Orden orden) {
        orden.actualizarTotal();
        return ordenRepository.save(orden);
    }

    @Override
    public void eliminar(Long id) {
        ordenRepository.deleteById(id);
    }

    @Override
    public List<Orden> obtenerPorUsuario(User usuario) {
        return ordenRepository.findByUsuario(usuario);
    }

    @Override
    public List<Orden> obtenerPorEstado(String estado) {
        return ordenRepository.findByEstado(estado);
    }
}
