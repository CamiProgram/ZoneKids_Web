package com.zonekids.springboot.api.zonekidsBackend;

import com.zonekids.springboot.api.zonekidsBackend.entities.Producto;
import com.zonekids.springboot.api.zonekidsBackend.entities.User;
import com.zonekids.springboot.api.zonekidsBackend.enums.RoleEnum;
import com.zonekids.springboot.api.zonekidsBackend.repositories.ProductoRepository;
import com.zonekids.springboot.api.zonekidsBackend.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

@SpringBootApplication
@ComponentScan(basePackages = "com.zonekids.springboot.api.zonekidsBackend") // Asegura que Spring escanee todos los paquetes
@EnableJdbcHttpSession // Habilitar sesiones persistentes con JDBC
public class FullrestApplication {
    
    @PersistenceContext
    private EntityManager entityManager;

    public static void main(String[] args) {
        SpringApplication.run(FullrestApplication.class, args); 
    }

    /**
     * Crea datos de prueba: 1 usuario ADMIN y 10 productos
     * Se ejecuta cada vez que inicia la aplicación
     */
    @Bean
    @Transactional
    public CommandLineRunner initData(UserRepository userRepository, ProductoRepository productoRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                System.out.println("🔄 Iniciando carga de datos de prueba...");

                // Crear usuario ADMIN de prueba (si no existe)
                if (userRepository.findByEmail("camilotapia828@gmail.com").isEmpty()) {
                    User adminUser = new User();
                    adminUser.setNombre("Admin Test");
                    adminUser.setEmail("camilotapia828@gmail.com");
                    adminUser.setContrasena(passwordEncoder.encode("admin123"));
                    adminUser.setRol(RoleEnum.ADMIN);
                    adminUser.setEstado("activo");
                    userRepository.save(adminUser);
                    System.out.println("✅ Usuario ADMIN creado (ID: " + adminUser.getId() + ")");
                } else {
                    System.out.println("⏭️ Usuario ADMIN ya existe, saltando...");
                }

                // Crear usuario CLIENTE de prueba (si no existe)
                if (userRepository.findByEmail("cliente@test.com").isEmpty()) {
                    User clientUser = new User();
                    clientUser.setNombre("Cliente Test");
                    clientUser.setEmail("cliente@test.com");
                    clientUser.setContrasena(passwordEncoder.encode("cliente123456"));
                    clientUser.setRol(RoleEnum.CLIENTE);
                    clientUser.setEstado("activo");
                    userRepository.save(clientUser);
                    System.out.println("✅ Usuario CLIENTE creado (ID: " + clientUser.getId() + ")");
                } else {
                    System.out.println("⏭️ Usuario CLIENTE ya existe, saltando...");
                }

                // Crear usuario VENDEDOR de prueba (si no existe)
                if (userRepository.findByEmail("vendedor@test.com").isEmpty()) {
                    User vendedorUser = new User();
                    vendedorUser.setNombre("Vendedor Test");
                    vendedorUser.setEmail("vendedor@test.com");
                    vendedorUser.setContrasena(passwordEncoder.encode("vendedor123456"));
                    vendedorUser.setRol(RoleEnum.VENDEDOR);
                    vendedorUser.setEstado("activo");
                    userRepository.save(vendedorUser);
                    System.out.println("✅ Usuario VENDEDOR creado (ID: " + vendedorUser.getId() + ")");
                } else {
                    System.out.println("⏭️ Usuario VENDEDOR ya existe, saltando...");
                }

                // Crear 10 productos de prueba - ROPA PARA BEBÉS (si la tabla está vacía)
                if (productoRepository.count() == 0) {
                    String[] nombresProductos = {
                            "Body Manga Larga Blanco",
                            "Pantalón de Algodón Azul",
                            "Vestido Flores Niña",
                            "Enterizo Rayado Bebé",
                            "Cardigan Tejido Suave",
                            "Conjunto 2 Piezas Rosa",
                            "Pants Deportivo Gris",
                            "Remera Estampada Colores",
                            "Pollera Tutú Blanco",
                            "Jumpsuit Jean Bebé"
                    };

                    String[] descripciones = {
                            "Body de manga larga 100% algodón, suave y cómodo para recién nacidos",
                            "Pantalón de algodón puro, perfecto para el día a día del bebé",
                            "Vestido estampado con flores, ideal para ocasiones especiales",
                            "Enterizo rayado en tonos pasteles, muy cómodo y versátil",
                            "Cardigan tejido en algodón, perfecto para mantener al bebé abrigado",
                            "Conjunto de 2 piezas en color rosa, remera y pantalón coordinados",
                            "Pants deportivo con cintura elástica, perfectos para jugar",
                            "Remera de algodón con estampado colorido y divertido",
                            "Pollera tutú en blanco, ideal para fiestas y ocasiones especiales",
                            "Jumpsuit de jean suave, perfecto para el día a día"
                    };

                    String[] categorias = {
                            "Bodys", "Pantalones", "Vestidos", "Enterizos",
                            "Cardigans", "Conjuntos", "Pants", "Remeras",
                            "Polleras", "Jumpsuits"
                    };

                    Double[] precios = {
                            12990.0, 15990.0, 19990.0, 17990.0,
                            22990.0, 24990.0, 14990.0, 12990.0,
                            18990.0, 23990.0
                    };

                    int productosCreados = 0;
                    for (int i = 0; i < 10; i++) {
                        Producto producto = new Producto();
                        producto.setNombre(nombresProductos[i]);
                        producto.setDescripcion(descripciones[i]);
                        producto.setPrecio(precios[i]);
                        producto.setStock(Math.max(5, 20 - (i * 2)));
                        producto.setCategoria(categorias[i]);
                        producto.setEstado("activo");
                        producto.setEsNuevo(i < 3);
                        producto.setEnOferta(i % 2 == 0);
                        producto.setPrecioOriginal(precios[i] * 1.2);
                        
                        // Agregar 3 imágenes específicas para cada producto
                        List<String> imagenes = new ArrayList<>();
                        
                        switch(i) {
                            case 0: // Body Manga Larga Blanco
                                imagenes.add("https://images.unsplash.com/photo-1516634305792-3bdfdbf57598?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1503994434240-e4e19a04e69f?w=300&h=300&fit=crop");
                                break;
                            case 1: // Pantalón de Algodón Azul
                                imagenes.add("https://images.unsplash.com/photo-1464645033556-6812c9d1c72e?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1542272604-787c62d465d1?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1542407692-96854a3f4eaa?w=300&h=300&fit=crop");
                                break;
                            case 2: // Vestido Flores Niña
                                imagenes.add("https://images.unsplash.com/photo-1619852884515-759bcc457b67?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop");
                                break;
                            case 3: // Enterizo Rayado Bebé
                                imagenes.add("https://images.unsplash.com/photo-1487915807519-e21cc028cb29?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1539533057440-7d8f2edfb386?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1578674387341-242eabf41b1b?w=300&h=300&fit=crop");
                                break;
                            case 4: // Cardigan Tejido Suave
                                imagenes.add("https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1515139552976-fcfe339d0bd0?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1551651186-e1c00e5ded7d?w=300&h=300&fit=crop");
                                break;
                            case 5: // Conjunto 2 Piezas Rosa
                                imagenes.add("https://images.unsplash.com/photo-1557804506-669214d2e601?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300&h=300&fit=crop");
                                break;
                            case 6: // Pants Deportivo Gris
                                imagenes.add("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1506251613332-f1c559323721?w=300&h=300&fit=crop");
                                break;
                            case 7: // Remera Estampada Colores
                                imagenes.add("https://images.unsplash.com/photo-1556821552-5f394a60becc?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1503342217505-b21f49d1eddb?w=300&h=300&fit=crop");
                                break;
                            case 8: // Pollera Tutú Blanco
                                imagenes.add("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1595813707802-463e5b72c0a6?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1591584505900-e96ebe4c35da?w=300&h=300&fit=crop");
                                break;
                            case 9: // Jumpsuit Jean Bebé
                                imagenes.add("https://images.unsplash.com/photo-1542272201-b1dd41bab2d2?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1545628346-915dfe2e7657?w=300&h=300&fit=crop");
                                imagenes.add("https://images.unsplash.com/photo-1598288553439-a0a87eb2baf2?w=300&h=300&fit=crop");
                                break;
                        }
                        
                        producto.setImagenesUrl(imagenes);
                        productoRepository.save(producto);
                        productosCreados++;
                    }
                    System.out.println("✅ " + productosCreados + " productos creados exitosamente (con 2-3 imágenes cada uno)");
                } else {
                    System.out.println("⏭️ Productos ya existen, saltando...");
                }

                long totalProductos = productoRepository.count();
                long totalUsuarios = userRepository.count();

                System.out.println("\n========================================");
                System.out.println("✅ DATOS DE PRUEBA CREADOS EXITOSAMENTE");
                System.out.println("========================================");
                System.out.println("📊 Registros en BD:");
                System.out.println("   👥 Usuarios: " + totalUsuarios);
                System.out.println("   📦 Productos: " + totalProductos);
                System.out.println("========================================");
                System.out.println("📧 ADMIN: camilotapia828@gmail.com");
                System.out.println("🔑 CONTRASEÑA: admin123");
                System.out.println("========================================");
                System.out.println("📧 CLIENTE: cliente@test.com");
                System.out.println("🔑 CONTRASEÑA: cliente123456");
                System.out.println("========================================");
                System.out.println("📧 VENDEDOR: vendedor@test.com");
                System.out.println("🔑 CONTRASEÑA: vendedor123456");
                System.out.println("========================================\n");

            } catch (Exception e) {
                System.out.println("❌ Error al crear datos de prueba: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}