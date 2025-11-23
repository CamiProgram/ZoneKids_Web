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
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.Arrays;

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
    public CommandLineRunner initData(UserRepository userRepository, ProductoRepository productoRepository) {
        return args -> {
            try {
                // Limpiar datos anteriores usando SQL nativo para evitar problemas con enums
                System.out.println("🔄 Limpiando datos anteriores...");
                try {
                    int productosEliminados = entityManager.createNativeQuery("DELETE FROM productos").executeUpdate();
                    System.out.println("   ✅ " + productosEliminados + " productos eliminados");
                } catch (Exception e) {
                    System.out.println("   ⚠️  No se pudieron eliminar productos: " + e.getMessage());
                }
                
                try {
                    int usuariosEliminados = entityManager.createNativeQuery("DELETE FROM usuarios").executeUpdate();
                    System.out.println("   ✅ " + usuariosEliminados + " usuarios eliminados");
                } catch (Exception e) {
                    System.out.println("   ⚠️  No se pudieron eliminar usuarios: " + e.getMessage());
                }
                
                entityManager.flush();
                System.out.println("✅ Base de datos limpiada");
            } catch (Exception e) {
                System.out.println("⚠️  Error al limpiar datos: " + e.getMessage());
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
                entityManager.flush();
                System.out.println("✅ Usuario ADMIN creado (ID: " + adminUser.getId() + ")");

                // Crear usuario CLIENTE de prueba
                User clientUser = new User();
                clientUser.setNombre("Cliente Test");
                clientUser.setEmail("cliente@test.com");
                clientUser.setContrasena("cliente123456");
                clientUser.setRol(RoleEnum.CLIENTE);
                clientUser.setEstado("activo");
                userRepository.save(clientUser);
                entityManager.flush();
                System.out.println("✅ Usuario CLIENTE creado (ID: " + clientUser.getId() + ")");

                // Crear usuario VENDEDOR de prueba
                User vendedorUser = new User();
                vendedorUser.setNombre("Vendedor Test");
                vendedorUser.setEmail("vendedor@test.com");
                vendedorUser.setContrasena("vendedor123456");
                vendedorUser.setRol(RoleEnum.VENDEDOR);
                vendedorUser.setEstado("activo");
                userRepository.save(vendedorUser);
                entityManager.flush();
                System.out.println("✅ Usuario VENDEDOR creado (ID: " + vendedorUser.getId() + ")");

                // Crear 10 productos de prueba - ROPA PARA BEBÉS
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
                        29.99, 35.99, 45.99, 39.99,
                        49.99, 55.99, 32.99, 28.99,
                        42.99, 52.99
                };

                // URL de imagen por defecto - Ropa de bebés
                String imageUrl1 = "https://via.placeholder.com/300x300?text=Ropa+Bebe+1";
                String imageUrl2 = "https://via.placeholder.com/300x300?text=Ropa+Bebe+2";
                String imageUrl3 = "https://via.placeholder.com/300x300?text=Ropa+Bebe+3";

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
                entityManager.flush();
                System.out.println("✅ " + productosCreados + " productos creados exitosamente");

                // Verificar que los datos se guardaron
                long productosEnBD = productoRepository.count();
                long usuariosEnBD = userRepository.count();
                System.out.println("\n========================================");
                System.out.println("✅ DATOS DE PRUEBA CREADOS EXITOSAMENTE");
                System.out.println("========================================");
                System.out.println("📊 Registros en BD:");
                System.out.println("   👥 Usuarios: " + usuariosEnBD);
                System.out.println("   📦 Productos: " + productosEnBD);
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