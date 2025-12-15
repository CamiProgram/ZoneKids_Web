# Documentación Técnica - Sistema de Upload de Imágenes

## Endpoints Implementados

### 1. Upload de Imagen Única
```
POST /api/v1/upload/imagen
```

**Descripción:** Sube una sola imagen al servidor.

**Request:**
```
Content-Type: multipart/form-data

Form Data:
  - file: <File> - Archivo de imagen
```

**Response (200 OK):**
```json
{
  "success": true,
  "fileName": "550e8400-e29b-41d4-a716-446655440000.webp",
  "size": 150000,
  "contentType": "image/webp",
  "url": "/uploads/550e8400-e29b-41d4-a716-446655440000.webp",
  "message": "Imagen subida exitosamente"
}
```

**Response (400/413):**
```json
{
  "success": false,
  "message": "Archivo demasiado grande" | "Formato de imagen no válido"
}
```

**Validaciones:**
- ✅ Formatos: JPEG, PNG, GIF, WebP, AVIF
- ✅ Tamaño máximo: 10MB
- ✅ Content-Type validado

---

### 2. Upload de Múltiples Imágenes
```
POST /api/v1/upload/imagenes
```

**Descripción:** Sube múltiples imágenes en una sola solicitud.

**Request:**
```
Content-Type: multipart/form-data

Form Data:
  - files: <File[]> - Array de archivos de imagen
```

**Response (200 OK):**
```json
{
  "success": true,
  "urls": [
    "/uploads/uuid-1.webp",
    "/uploads/uuid-2.webp",
    "/uploads/uuid-3.webp"
  ],
  "message": "Las 3 imágenes se subieron correctamente"
}
```

**Response (400):**
```json
{
  "success": false,
  "uploadedFiles": [],
  "failedFiles": [
    {
      "fileName": "archivo.pdf",
      "error": "Formato de imagen no válido"
    }
  ],
  "message": "Algunos archivos no pudieron ser procesados"
}
```

**Validaciones:**
- ✅ Procesa cada archivo individualmente
- ✅ Retorna URLs exitosas
- ✅ Reporta errores por archivo
- ✅ Manejo graceful de errores parciales

---

### 3. Crear Producto
```
POST /api/v1/productos
```

**Descripción:** Crea un nuevo producto con sus imágenes.

**Request:**
```json
{
  "nombre": "Juguete Educativo",
  "descripcion": "Descripción del juguete",
  "precio": 29990,
  "precioOriginal": 39990,
  "stock": 50,
  "categoria": "Juguetes",
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

**Response (201 Created):**
```json
{
  "id": 1,
  "nombre": "Juguete Educativo",
  "descripcion": "Descripción del juguete",
  "precio": 29990,
  "precioOriginal": 39990,
  "stock": 50,
  "categoria": "Juguetes",
  "estado": "activo",
  "esNuevo": true,
  "enOferta": true,
  "imagenes": [
    "/uploads/uuid-1.webp",
    "/uploads/uuid-2.webp",
    "/uploads/uuid-3.webp"
  ],
  "createdAt": "2025-11-23T12:00:00Z",
  "updatedAt": "2025-11-23T12:00:00Z"
}
```

**Validaciones:**
- ✅ Requiere exactamente 3 imágenes
- ✅ Campos obligatorios: nombre, precio, stock, imagenes
- ✅ Valida estructura de imagenes array

---

### 4. Obtener Lista de Productos
```
GET /api/v1/productos
```

**Descripción:** Retorna todos los productos con sus imágenes.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Juguete Educativo",
    "descripcion": "...",
    "precio": 29990,
    "precioOriginal": 39990,
    "stock": 50,
    "categoria": "Juguetes",
    "estado": "activo",
    "esNuevo": true,
    "enOferta": true,
    "imagenes": ["url1", "url2", "url3"]
  },
  ...
]
```

---

### 5. Obtener Detalle de Producto
```
GET /api/v1/productos/{id}
```

**Descripción:** Obtiene los detalles completos de un producto específico.

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Juguete Educativo",
  "descripcion": "...",
  "precio": 29990,
  "precioOriginal": 39990,
  "stock": 50,
  "categoria": "Juguetes",
  "estado": "activo",
  "esNuevo": true,
  "enOferta": true,
  "imagenes": ["url1", "url2", "url3"]
}
```

**Response (404 Not Found):**
```json
{
  "message": "Producto no encontrado"
}
```

---

### 6. Actualizar Producto
```
PUT /api/v1/productos/{id}
```

**Descripción:** Actualiza un producto existente, incluyendo sus imágenes.

**Request:**
```json
{
  "nombre": "Juguete Educativo Mejorado",
  "descripcion": "Nueva descripción",
  "precio": 34990,
  "precioOriginal": 44990,
  "stock": 75,
  "categoria": "Juguetes Educativos",
  "estado": "activo",
  "esNuevo": false,
  "enOferta": true,
  "imagenes": [
    "/uploads/uuid-1.webp",
    "/uploads/uuid-2.webp",
    "/uploads/uuid-3.webp"
  ]
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "nombre": "Juguete Educativo Mejorado",
  "descripcion": "Nueva descripción",
  "precio": 34990,
  "precioOriginal": 44990,
  "stock": 75,
  "categoria": "Juguetes Educativos",
  "estado": "activo",
  "esNuevo": false,
  "enOferta": true,
  "imagenes": [
    "/uploads/uuid-1.webp",
    "/uploads/uuid-2.webp",
    "/uploads/uuid-3.webp"
  ],
  "updatedAt": "2025-11-23T13:00:00Z"
}
```

**Validaciones:**
- ✅ Requiere exactamente 3 imágenes
- ✅ Valida que el producto exista
- ✅ Preserva campos no actualizados

---

### 7. Eliminar Producto
```
DELETE /api/v1/productos/{id}
```

**Descripción:** Elimina un producto y sus imágenes asociadas.

**Response (200 OK):**
```json
{
  "message": "Producto eliminado exitosamente",
  "id": 1
}
```

**Response (404 Not Found):**
```json
{
  "message": "Producto no encontrado"
}
```

**Nota:** Debería eliminar también los archivos de `/uploads/`

---

## Flujos de Implementación en Frontend

### Flujo 1: Crear Producto

```javascript
// Paso 1: Usuario selecciona 3 imágenes
const imagenes = [file1, file2, file3];

// Paso 2: Crear FormData con las 3 imágenes
const formData = new FormData();
imagenes.forEach(img => formData.append('files', img));

// Paso 3: Upload de imágenes
const uploadResponse = await axios.post(
  'http://localhost:8080/api/v1/upload/imagenes',
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);

// uploadResponse.data:
// {
//   success: true,
//   urls: ["/uploads/uuid-1.webp", "/uploads/uuid-2.webp", "/uploads/uuid-3.webp"]
// }

// Paso 4: Crear producto con URLs
const productData = {
  nombre: 'Juguete',
  descripcion: '...',
  precio: 29990,
  stock: 50,
  categoria: 'Juguetes',
  estado: 'activo',
  imagenes: uploadResponse.data.urls  // Array de URLs
};

const productResponse = await axios.post(
  'http://localhost:8080/api/v1/productos',
  productData
);

// Paso 5: Redirigir
navigate('/admin/products');
```

---

### Flujo 2: Editar Producto

```javascript
// Paso 1: Cargar producto actual
const product = await axios.get(`/api/v1/productos/${id}`);
// producto.imagenes = ["url1", "url2", "url3"]

// Paso 2: Si hay nuevas imágenes
const newImages = [file1, file2]; // Menos de 3
const formData = new FormData();
newImages.forEach(img => formData.append('files', img));

const uploadResponse = await axios.post(
  '/api/v1/upload/imagenes',
  formData
);

// Paso 3: Combinar imágenes viejas + nuevas
const allImages = [
  ...product.imagenes.slice(0, 1), // Mantener la primera vieja
  ...uploadResponse.data.urls       // Agregar 2 nuevas
];

// Paso 4: Actualizar producto
await axios.put(
  `/api/v1/productos/${id}`,
  { ...product, imagenes: allImages }
);
```

---

### Flujo 3: Ver Detalle de Producto

```javascript
// Paso 1: Cargar producto
const product = await axios.get(`/api/v1/productos/${id}`);

// Paso 2: Usar ImageCarousel
<ImageCarousel imagenes={product.imagenes} productName={product.nombre} />

// ImageCarousel maneja:
// - Navegación con botones
// - Miniaturas
// - Contador de imagen actual
```

---

## Códigos de Error HTTP

| Código | Significado | Acción Frontend |
|--------|-------------|-----------------|
| 200 | OK | Continuar con el flujo |
| 201 | Created | Mostrar éxito, redirigir |
| 400 | Bad Request | Mostrar mensaje de error |
| 404 | Not Found | Mostrar "Producto no encontrado" |
| 413 | Payload Too Large | Mostrar "Archivo demasiado grande" |
| 415 | Unsupported Media Type | Mostrar "Formato no válido" |
| 500 | Server Error | Mostrar error genérico |

---

## Estructura de Directorio de Uploads

```
project-root/
├── src/
├── public/
├── uploads/                    # Directorio de imágenes subidas
│   ├── 550e8400-e29b-41d4.jpg
│   ├── 660f9500-f30c-42e5.png
│   ├── 770g0600-g41d-53f6.webp
│   └── ...
└── ...
```

**Nota:** Las URLs retornadas son relativas: `/uploads/uuid.ext`
Para acceso completo: `http://localhost:8080/uploads/uuid.ext`

---

## Manejo de Errores Recomendado

```javascript
try {
  // Upload
  const uploadRes = await axios.post('/api/v1/upload/imagenes', formData);
  
  if (!uploadRes.data.success) {
    setError('Error al subir imágenes');
    return;
  }
  
  // Crear producto
  const productRes = await axios.post(
    '/api/v1/productos',
    { ...data, imagenes: uploadRes.data.urls }
  );
  
  setSuccess('Producto creado exitosamente');
  navigate('/admin/products');
  
} catch (err) {
  const message = err.response?.data?.message || 'Error desconocido';
  setError(message);
}
```

---

## Validaciones del Frontend

### Validación de Imágenes Antes de Upload

```javascript
const validateImages = (files) => {
  const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  for (let file of files) {
    // Validar formato
    if (!allowedFormats.includes(file.type)) {
      throw new Error(`Formato no válido: ${file.name}`);
    }
    
    // Validar tamaño
    if (file.size > maxSize) {
      throw new Error(`Archivo demasiado grande: ${file.name}`);
    }
  }
  
  return true;
};
```

---

## Headers HTTP

### Para Upload de Imágenes
```
POST /api/v1/upload/imagenes
Content-Type: multipart/form-data; boundary=...
Authorization: Bearer {token} (si se implementa)
```

### Para Crear/Actualizar Producto
```
POST /api/v1/productos
Content-Type: application/json
Authorization: Bearer {token} (si se implementa)
```

---

## Rate Limiting (Recomendado)

Implementar en backend:
- Máximo 10 requests por minuto para upload
- Máximo 100 requests por minuto para crear/actualizar

---

## Caching

El frontend no cachea las imágenes por defecto.
Si se necesita, agregar en nginx/servidor:

```nginx
location /uploads/ {
  expires 30d;
  add_header Cache-Control "public, immutable";
}
```

---

## Consideraciones de Seguridad

1. **Validación de Archivos:**
   - ✅ Validar MIME type en backend
   - ✅ Validar extensión de archivo
   - ✅ Validar tamaño máximo
   - ✅ Sanitizar nombres de archivo

2. **Almacenamiento:**
   - ✅ Almacenar fuera de la raíz web
   - ✅ Usar UUID para nombres
   - ✅ No permitir ejecución en directorio uploads

3. **Acceso:**
   - ✅ Validar que el usuario tiene permisos
   - ✅ Proteger endpoint de upload con autenticación (próximo)
   - ✅ Implementar CORS correctamente

---

## Próximas Mejoras

1. **Compresión de imágenes:** Comprimir antes de retornar
2. **Thumbnails:** Generar automáticamente
3. **Lazy loading:** Cargar imágenes bajo demanda
4. **CDN:** Servir imágenes desde CDN
5. **Autenticación:** Proteger endpoints con JWT
6. **Watermark:** Agregar marca de agua a imágenes
7. **Optimización:** WebP automático para soportar navegadores

---

**Última actualización:** 23 de noviembre, 2025
**Version:** 1.0 - Documentación técnica completa
