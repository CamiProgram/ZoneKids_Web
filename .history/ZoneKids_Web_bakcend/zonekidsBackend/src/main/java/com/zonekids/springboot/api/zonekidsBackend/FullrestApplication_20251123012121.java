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
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;

import java.util.Arrays;

@SpringBootApplication
@ComponentScan(basePackages = "com.zonekids.springboot.api.zonekidsBackend") // Asegura que Spring escanee todos los paquetes
@EnableJdbcHttpSession // Habilitar sesiones persistentes con JDBC
public class FullrestApplication { 

    public static void main(String[] args) {
        SpringApplication.run(FullrestApplication.class, args); 
    }

    /**
     * Crea datos de prueba: 1 usuario ADMIN y 10 productos
     * Se ejecuta cada vez que inicia la aplicación
     */
    @Bean
    public CommandLineRunner initData(UserRepository userRepository, ProductoRepository productoRepository) {
        return args -> {
            try {
                // Limpiar datos anteriores - usar delete by query en lugar de deleteAll
                productoRepository.deleteAll();
                userRepository.deleteAll();
            } catch (Exception e) {
                System.out.println("⚠️  Error al limpiar datos anteriores (ignorado): " + e.getMessage());
            }

            try {
                // Crear usuario ADMIN de prueba
                User adminUser = new User();
                adminUser.setNombre("Admin Test");
                adminUser.setEmail("camilotapia828@gmail.com");
                adminUser.setContrasena("admin123");
                adminUser.setRol(RoleEnum.ADMIN);
                adminUser.setEstado("activo");
                userRepository.save(adminUser);
                System.out.println("✅ Usuario ADMIN creado");

                // Crear usuario CLIENTE de prueba
                User clientUser = new User();
                clientUser.setNombre("Cliente Test");
                clientUser.setEmail("cliente@test.com");
                clientUser.setContrasena("cliente123456");
                clientUser.setRol(RoleEnum.CLIENTE);
                clientUser.setEstado("activo");
                userRepository.save(clientUser);
                System.out.println("✅ Usuario CLIENTE creado");

                // Crear usuario VENDEDOR de prueba
                User vendedorUser = new User();
                vendedorUser.setNombre("Vendedor Test");
                vendedorUser.setEmail("vendedor@test.com");
                vendedorUser.setContrasena("vendedor123456");
                vendedorUser.setRol(RoleEnum.VENDEDOR);
                vendedorUser.setEstado("activo");
                userRepository.save(vendedorUser);
                System.out.println("✅ Usuario VENDEDOR creado");

                // Crear 10 productos de prueba
                String[] nombresProductos = {
                        "Laptop Gaming",
                        "Mouse Inalámbrico",
                        "Teclado Mecánico",
                        "Monitor 4K",
                        "Auriculares Bluetooth",
                        "Webcam HD",
                        "Mousepad Gaming",
                        "Cable USB-C",
                        "Hub USB 3.0",
                        "Refrigerador de Laptop"
                };

                String[] descripciones = {
                        "Laptop potente para gaming con procesador i7 y 16GB RAM",
                        "Mouse inalámbrico de alta precisión con 3 velocidades",
                        "Teclado mecánico RGB con switches Cherry MX",
                        "Monitor UltraHD 4K con 144Hz para gaming",
                        "Auriculares inalámbricos con cancelación de ruido",
                        "Webcam 1080p Full HD con micrófono incorporado",
                        "Mousepad grande de goma antideslizante",
                        "Cable USB-C 2.0 de 2 metros compatible con todos",
                        "Hub USB 3.0 con 4 puertos",
                        "Ventilador refrigerador para laptops"
                };

                String[] categorias = {
                        "Electrónica", "Accesorios", "Periféricos", "Monitores",
                        "Audio", "Accesorios", "Accesorios", "Cables",
                        "Accesorios", "Accesorios"
                };

                Double[] precios = {
                        1299.99, 45.99, 89.99, 599.99,
                        199.99, 79.99, 25.99, 12.99,
                        35.99, 29.99
                };

                // URL de imagen por defecto
                String imageUrl1 = "https://via.placeholder.com/300x300?text=Producto";
                String imageUrl2 = "https://via.placeholder.com/300x300?text=Vista2";
                String imageUrl3 = "https://via.placeholder.com/300x300?text=Vista3";

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

                    // Asignar 2-3 imágenes
                    producto.setImagenesUrl(Arrays.asList(
                            imageUrl1 + "+" + i,
                            imageUrl2 + "+" + i,
                            imageUrl3 + "+" + i
                    ));

                    productoRepository.save(producto);
                    productosCreados++;
                }
                System.out.println("✅ " + productosCreados + " productos creados");

                System.out.println("\n========================================");
                System.out.println("✅ DATOS DE PRUEBA CREADOS EXITOSAMENTE");
                System.out.println("========================================");
                System.out.println("📧 ADMIN: camilotapia828@gmail.com");
                System.out.println("🔑 CONTRASEÑA: admin123");
                System.out.println("========================================");
                System.out.println("📧 CLIENTE: cliente@test.com");
                System.out.println("🔑 CONTRASEÑA: cliente123456");
                System.out.println("========================================");
                System.out.println("📧 VENDEDOR: vendedor@test.com");
                System.out.println("🔑 CONTRASEÑA: vendedor123456");
                System.out.println("========================================");
                System.out.println("📦 10 PRODUCTOS DISPONIBLES");
                System.out.println("========================================\n");
            } catch (Exception e) {
                System.out.println("❌ Error al crear datos de prueba: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}