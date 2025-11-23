USE zonekids_bd;

-- Deshabilitar restricciones de clave foránea
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar todas las tablas
DELETE FROM producto_imagenes;
DELETE FROM productos;
DELETE FROM usuarios;

-- Resetear auto increment
ALTER TABLE productos AUTO_INCREMENT = 1;
ALTER TABLE usuarios AUTO_INCREMENT = 1;
ALTER TABLE producto_imagenes AUTO_INCREMENT = 1;

-- Habilitar restricciones de clave foránea
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar
SELECT COUNT(*) as 'Total Productos' FROM productos;
SELECT COUNT(*) as 'Total Usuarios' FROM usuarios;
