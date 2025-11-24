# Guía de Prueba - Sistema de Upload de Imágenes

## Requisitos Previos

- Backend corriendo en `http://localhost:8080`
- Endpoints implementados:
  - `POST /api/v1/upload/imagen` - Subir una imagen
  - `POST /api/v1/upload/imagenes` - Subir múltiples imágenes
  - `POST /api/v1/productos` - Crear producto
  - `GET /api/v1/productos` - Listar productos
  - `GET /api/v1/productos/{id}` - Obtener detalle
  - `PUT /api/v1/productos/{id}` - Actualizar producto
  - `DELETE /api/v1/productos/{id}` - Eliminar producto

---

## Pruebas del Flujo de Creación de Producto

### 1. Crear un Nuevo Producto

**Pasos:**
1. Ir a `/admin/products/crear`
2. Completar formulario:
   - Nombre: "Juguete Educativo"
   - Descripción: "Juguete para niños"
   - Precio Final: 29,990
   - Precio Original: 39,990 (opcional)
   - Stock: 50
   - Categoría: "Juguetes"
3. **Seleccionar exactamente 3 imágenes**
   - Formatos válidos: JPEG, PNG, GIF, WebP, AVIF
   - Máximo 10MB cada una

**Validaciones a verificar:**
- ✅ Sin 3 imágenes: Botón "Crear Producto" está deshabilitado
- ✅ Visa previa muestra las 3 imágenes con miniaturas
- ✅ Cada miniatura muestra: nombre del archivo y tamaño
- ✅ Botón (X) permite eliminar cada imagen

### 2. Enviar Formulario

**Esperado:**
1. Estado cambia a "Subiendo imágenes..."
2. Las 3 imágenes se suben a `/api/v1/upload/imagenes`
3. Backend retorna array de URLs
4. Producto se crea con las 3 URLs en array `imagenes`
5. Redirecciona a `/admin/products`
6. Mensaje de éxito: "✅ Producto creado exitosamente"

---

## Pruebas de Edición de Producto

### 1. Editar un Producto Existente

**Pasos:**
1. Ir a `/admin/products`
2. Click en "Editar" de cualquier producto
3. Verás las 3 imágenes actuales del producto

**Opciones:**
- **Opción A:** No cambiar imágenes - simplemente editar otros campos
- **Opción B:** Reemplazar todas las imágenes - seleccionar 3 nuevas

**Validaciones a verificar:**
- ✅ Imágenes actuales se muestran en grid
- ✅ Total de imágenes siempre debe ser 3
- ✅ Mostrador: "Total de imágenes: X/3"
- ✅ Puedo eliminar imágenes actuales (hacen falta nuevas)
- ✅ Puedo agregar nuevas imágenes (si elimino actuales)

### 2. Casos de Uso

**Caso 1:** Solo editar datos (sin cambiar imágenes)
- No seleccionar ninguna imagen nueva
- Editar solo otros campos
- Total sigue siendo 3/3
- Click en "Actualizar"

**Caso 2:** Reemplazar todas las imágenes
- Eliminar las 3 imágenes actuales
- Seleccionar 3 imágenes nuevas
- Total debe ser 3/3
- Click en "Actualizar"

---

## Pruebas de Visualización en el Frontend

### 1. Página de Detalles del Producto

**Pasos:**
1. Desde Home o búsqueda, hacer click en un producto
2. Se abre `/producto/{id}`

**Validaciones a verificar:**
- ✅ Se muestra carrusel con las 3 imágenes
- ✅ Botones de navegación (< y >) funcionan
- ✅ Miniaturas en la parte inferior
- ✅ Contador "1 / 3", "2 / 3", etc.
- ✅ Click en miniatura salta a esa imagen

### 2. Tarjetas de Producto en Home

**Pasos:**
1. Ir a `/` (home)

**Validaciones a verificar:**
- ✅ Cada tarjeta muestra la primera imagen (imagenes[0])
- ✅ No hay errores si no hay imágenes (fallback)
- ✅ Dimensiones consistentes

### 3. Tabla de Administración

**Pasos:**
1. Ir a `/admin/products`

**Validaciones a verificar:**
- ✅ Columna "Imágenes" muestra las 3 miniaturas
- ✅ Hover sobre imagen hace zoom
- ✅ Si hubiera más de 3 imágenes: muestra badge "+N"
- ✅ Responsive en móvil: imágenes se reordenan

---

## Pruebas del Carrito

### 1. Agregar Producto al Carrito

**Pasos:**
1. Desde detalle de producto: Click en "Añadir al Carrito"
2. Modal del carrito se abre

**Validaciones a verificar:**
- ✅ Producto aparece en carrito
- ✅ Muestra la primera imagen del producto (imagenes[0])
- ✅ Precio y cantidad correctos
- ✅ Contador en botón del carrito: "🛒 Carrito (1)"

### 2. Operaciones en el Carrito

**Validaciones a verificar:**
- ✅ Botones + y - ajustan cantidad
- ✅ Botón "Eliminar" quita el producto
- ✅ Total se calcula correctamente
- ✅ Carrito vacío muestra mensaje: "Tu carrito está vacío"

---

## Pruebas de Errores

### Error: Menos de 3 imágenes

**Reproducir:**
1. Crear producto con solo 2 imágenes
2. Intentar click en "Crear Producto"

**Esperado:**
- ❌ Botón deshabilitado (gris)
- ❌ Mensaje: "Debes seleccionar exactamente 3 imágenes"

### Error: Imagen > 10MB

**Reproducir:**
1. Seleccionar imagen > 10MB
2. Click en "Crear Producto"

**Esperado:**
- ❌ Error de upload
- ❌ Mensaje del servidor: "Archivo demasiado grande"
- ❌ Imagen no se sube

### Error: Formato inválido

**Reproducir:**
1. Intentar seleccionar archivo .txt o .pdf
2. Input solo acepta: image/jpeg, image/png, image/gif, image/webp, image/avif

**Esperado:**
- ❌ El archivo no aparece en la lista (filtrado por browser)

---

## Checklist de Validación

### Creación de Producto
- [ ] Solo permite seleccionar archivos de imagen
- [ ] Muestra vista previa con 3 miniaturas
- [ ] Botón deshabilitado sin 3 imágenes
- [ ] Botón (X) elimina imágenes individuales
- [ ] Al crear: sube imágenes a `/api/v1/upload/imagenes`
- [ ] Al crear: envía producto a `/api/v1/productos` con array imagenes
- [ ] Redirige a `/admin/products` tras éxito
- [ ] Mensaje de éxito: "✅ Producto creado exitosamente"

### Edición de Producto
- [ ] Carga las 3 imágenes actuales
- [ ] Muestra "Imágenes Actuales" y "Nuevas Imágenes" por separado
- [ ] Total siempre debe ser 3
- [ ] Puedo eliminar imágenes actuales
- [ ] Puedo agregar nuevas imágenes
- [ ] Botón deshabilitado si total ≠ 3
- [ ] Al actualizar: envía a `/api/v1/productos/{id}`
- [ ] Mensaje de éxito: "✅ Producto actualizado exitosamente"

### Visualización
- [ ] Carrusel muestra las 3 imágenes correctamente
- [ ] Navegación con botones (< >) funciona
- [ ] Miniaturas permiten saltar a imagen
- [ ] Contador muestra posición actual
- [ ] Home muestra primera imagen de cada producto
- [ ] Admin table muestra 3 miniaturas por producto
- [ ] Carrito muestra imagen del producto

### Manejo de Errores
- [ ] Validación de 3 imágenes en frontend
- [ ] Mensajes de error claros y visibles
- [ ] Estados de carga informados al usuario
- [ ] Fallback para productos sin imágenes

---

## Ejemplos de Datos de Prueba

### Producto de Prueba
```json
{
  "nombre": "Bloques de Construcción Educativos",
  "descripcion": "Set de bloques para desarrollar creatividad y motricidad fina",
  "precio": 25990,
  "precioOriginal": 35990,
  "stock": 100,
  "categoria": "Bloques y construcción",
  "estado": "activo",
  "esNuevo": true,
  "enOferta": true,
  "imagenes": [
    "/uploads/uuid-1.webp",
    "/uploads/uuid-2.webp",
    "/uploads/uuid-3.webp"
  ]
}
```

---

## URLs de Prueba

| Acción | URL |
|--------|-----|
| Home | `http://localhost:5173/` |
| Crear Producto | `http://localhost:5173/admin/products/crear` |
| Editar Producto | `http://localhost:5173/admin/products/editar/1` |
| Detalle Producto | `http://localhost:5173/producto/1` |
| Admin Products | `http://localhost:5173/admin/products` |
| Búsqueda | `http://localhost:5173/buscar?q=ejemplo` |

---

## Notas Importantes

1. **Validación en Backend:** El frontend confía en que el backend valida:
   - Formatos de imagen correctos
   - Tamaño máximo 10MB
   - Valores correctos en respuesta

2. **Estructura de Respuesta de Upload:**
   ```json
   {
     "success": true,
     "urls": ["/uploads/uuid-1.webp", "/uploads/uuid-2.webp", "/uploads/uuid-3.webp"],
     "message": "Las 3 imágenes se subieron correctamente"
   }
   ```

3. **Estructura de Producto:**
   ```json
   {
     "id": 1,
     "nombre": "...",
     "imagenes": ["url1", "url2", "url3"],
     ...
   }
   ```

4. **LocalStorage:** El carrito se guarda en localStorage (si está implementado)

5. **Fallbacks:** Si no hay imágenes, se usa `/assets/Zonekids_logo_web.webp`

---

**Última actualización:** 23 de noviembre, 2025
**Version:** 1.0 - Guía de prueba completa
