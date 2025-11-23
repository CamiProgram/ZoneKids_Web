-- Script para crear usuario de prueba ADMIN en ZoneKids

-- Primero, verificar usuarios existentes
SELECT * FROM usuarios;

-- Si el usuario ADMIN no existe, crear uno
INSERT INTO usuarios (nombre, email, contrasena, rol, estado, fecha_creacion)
VALUES (
    'Admin Test',
    'admin@zonekids.com',
    '$2a$10$slYQmyNdGzin7olVN5zCEOVbT/sPvV5LPZ4r3n7J2y0e9O/k5H1mC',
    'ADMIN',
    'activo',
    NOW()
);

-- La contraseña es: admin123 (hash BCrypt)
-- SELECT * FROM usuarios WHERE rol = 'ADMIN';
