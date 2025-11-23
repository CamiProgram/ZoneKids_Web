USE zonekids_bd;

-- Limpiar todas las tablas
DELETE FROM productos;
DELETE FROM usuarios;

-- Resetear auto increment
ALTER TABLE productos AUTO_INCREMENT = 1;
ALTER TABLE usuarios AUTO_INCREMENT = 1;

-- Verificar
SELECT COUNT(*) as 'Total Productos' FROM productos;
SELECT COUNT(*) as 'Total Usuarios' FROM usuarios;
