-- ============================================================================
-- ARCHIVO DE DATOS DE PRUEBA - ZoneKids Database
-- ============================================================================
-- Este archivo contiene inserts de usuarios y productos para testing
-- Ejecutar este script después de que las tablas hayan sido creadas
-- ============================================================================

-- ============================================================================
-- INSERCIÓN DE USUARIOS DE PRUEBA
-- ============================================================================
-- Nota: Las contraseñas están hasheadas con BCrypt
-- Password: admin123 -> $2a$10$slYQmyNdGzin7olVN3p5Be7DWkIvVA8/8kxWfefEffcZeIHwJ8H/m
-- Password: vendedor123 -> $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUUtJ7sFRkZ8/K7UDG
-- Password: cliente123 -> $2a$10$VJhN8K8H6Qs5JnP4R2mL8uQ3W7xY9zK0L5mN6oP7qR8sT9uV0W

-- ADMIN USER
INSERT INTO usuarios (nombre, email, contrasena, rol, estado, fecha_creacion, fecha_actualizacion) 
VALUES (
    'Admin Principal',
    'admin@zonekids.com',
    '$2a$10$slYQmyNdGzin7olVN3p5Be7DWkIvVA8/8kxWfefEffcZeIHwJ8H/m',
    'ADMIN',
    'activo',
    NOW(),
    NOW()
);

-- VENDEDOR USERS
INSERT INTO usuarios (nombre, email, contrasena, rol, estado, fecha_creacion, fecha_actualizacion) 
VALUES (
    'Juan Vendedor',
    'juan.vendedor@zonekids.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUUtJ7sFRkZ8/K7UDG',
    'VENDEDOR',
    'activo',
    NOW(),
    NOW()
);

INSERT INTO usuarios (nombre, email, contrasena, rol, estado, fecha_creacion, fecha_actualizacion) 
VALUES (
    'María Vendedora',
    'maria.vendedora@zonekids.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUUtJ7sFRkZ8/K7UDG',
    'VENDEDOR',
    'activo',
    NOW(),
    NOW()
);

-- CLIENTE USERS
INSERT INTO usuarios (nombre, email, contrasena, rol, estado, fecha_creacion, fecha_actualizacion) 
VALUES (
    'Carlos Cliente',
    'carlos.cliente@zonekids.com',
    '$2a$10$VJhN8K8H6Qs5JnP4R2mL8uQ3W7xY9zK0L5mN6oP7qR8sT9uV0W',
    'CLIENTE',
    'activo',
    NOW(),
    NOW()
);

INSERT INTO usuarios (nombre, email, contrasena, rol, estado, fecha_creacion, fecha_actualizacion) 
VALUES (
    'Laura Cliente',
    'laura.cliente@zonekids.com',
    '$2a$10$VJhN8K8H6Qs5JnP4R2mL8uQ3W7xY9zK0L5mN6oP7qR8sT9uV0W',
    'CLIENTE',
    'inactivo',
    NOW(),
    NOW()
);

-- ============================================================================
-- INSERCIÓN DE PRODUCTOS DE PRUEBA
-- ============================================================================

-- Producto 1: Body Manga Larga
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, estado, es_nuevo, en_oferta, fecha_creacion, fecha_actualizacion, precio_original) 
VALUES (
    'Body Manga Larga Blanco',
    'Body de algodón 100% para bebé, manga larga, diseño clásico blanco',
    2900,
    50,
    'Bodys',
    'activo',
    true,
    false,
    NOW(),
    NOW(),
    3500
);

-- Agregar imágenes al producto 1
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (1, '/uploads/body_blanco_frente.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (1, '/uploads/body_blanco_espalda.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (1, '/uploads/body_blanco_detalle.jpg');

-- Producto 2: Pijama Ositos
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, estado, es_nuevo, en_oferta, fecha_creacion, fecha_actualizacion, precio_original) 
VALUES (
    'Pijama Ositos Azul',
    'Pijama suave de algodón con estampado de ositos, perfecto para la hora de dormir',
    3500,
    35,
    'Pijamas',
    'activo',
    false,
    true,
    NOW(),
    NOW(),
    4500
);

-- Agregar imágenes al producto 2
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (2, '/uploads/pijama_ositos_frente.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (2, '/uploads/pijama_ositos_espalda.jpg');

-- Producto 3: Pantalón Deportivo
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, estado, es_nuevo, en_oferta, fecha_creacion, fecha_actualizacion, precio_original) 
VALUES (
    'Pantalón Deportivo Gris',
    'Pantalón deportivo cómodo en color gris, ideal para actividades físicas',
    1800,
    60,
    'Pantalones',
    'activo',
    false,
    false,
    NOW(),
    NOW(),
    1800
);

-- Agregar imágenes al producto 3
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (3, '/uploads/pantalon_gris_frente.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (3, '/uploads/pantalon_gris_lateral.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (3, '/uploads/pantalon_gris_detalle.jpg');

-- Producto 4: Camiseta Estampada
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, estado, es_nuevo, en_oferta, fecha_creacion, fecha_actualizacion, precio_original) 
VALUES (
    'Camiseta Estampada Arcoíris',
    'Camiseta de algodón con estampado colorido tipo arcoíris',
    1500,
    75,
    'Camisetas',
    'activo',
    true,
    false,
    NOW(),
    NOW(),
    2000
);

-- Agregar imágenes al producto 4
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (4, '/uploads/camiseta_arcoiris_frente.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (4, '/uploads/camiseta_arcoiris_espalda.jpg');

-- Producto 5: Abrigo Lana
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, estado, es_nuevo, en_oferta, fecha_creacion, fecha_actualizacion, precio_original) 
VALUES (
    'Abrigo de Lana Rojo',
    'Abrigo abrigador de lana pura, color rojo brillante, cierre con botones',
    5500,
    20,
    'Abrigos',
    'activo',
    false,
    true,
    NOW(),
    NOW(),
    7000
);

-- Agregar imágenes al producto 5
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (5, '/uploads/abrigo_rojo_frente.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (5, '/uploads/abrigo_rojo_espalda.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (5, '/uploads/abrigo_rojo_detalle.jpg');

-- Producto 6: Shorts Denim
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, estado, es_nuevo, en_oferta, fecha_creacion, fecha_actualizacion, precio_original) 
VALUES (
    'Shorts Denim Azul',
    'Shorts de denim azul clásico, cómodos y duraderos',
    2200,
    45,
    'Shorts',
    'activo',
    false,
    false,
    NOW(),
    NOW(),
    2200
);

-- Agregar imágenes al producto 6
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (6, '/uploads/shorts_denim_frente.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (6, '/uploads/shorts_denim_espalda.jpg');

-- Producto 7: Sudadera con Capucha
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, estado, es_nuevo, en_oferta, fecha_creacion, fecha_actualizacion, precio_original) 
VALUES (
    'Sudadera con Capucha Verde',
    'Sudadera suave con capucha, color verde pastel, ideal para cualquier clima',
    3200,
    30,
    'Sudaderas',
    'activo',
    true,
    false,
    NOW(),
    NOW(),
    4000
);

-- Agregar imágenes al producto 7
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (7, '/uploads/sudadera_verde_frente.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (7, '/uploads/sudadera_verde_lateral.jpg');

-- Producto 8: Vestido Floral
INSERT INTO productos (nombre, descripcion, precio, stock, categoria, estado, es_nuevo, en_oferta, fecha_creacion, fecha_actualizacion, precio_original) 
VALUES (
    'Vestido Floral Rosa',
    'Vestido con estampado floral, perfecto para ocasiones especiales',
    4000,
    15,
    'Vestidos',
    'inactivo',
    false,
    true,
    NOW(),
    NOW(),
    5500
);

-- Agregar imágenes al producto 8
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (8, '/uploads/vestido_floral_frente.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (8, '/uploads/vestido_floral_lateral.jpg');
INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (8, '/uploads/vestido_floral_detalle.jpg');

-- ============================================================================
-- RESUMEN DE DATOS INSERTADOS
-- ============================================================================
-- Usuarios: 5 (1 ADMIN, 2 VENDEDOR, 2 CLIENTE)
-- Productos: 8 (con 2-3 imágenes cada uno)
-- Total de registros de imágenes: 20
-- ============================================================================

-- Credenciales para testing:
-- ADMIN: admin@zonekids.com / admin123
-- VENDEDOR: juan.vendedor@zonekids.com / vendedor123
-- CLIENTE: carlos.cliente@zonekids.com / cliente123
