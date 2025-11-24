import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import '../../styles/pages/crearProducto.css';

export const CrearProducto = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [categoria, setCategoria] = useState('');
    const [estado, setEstado] = useState('activo');
    const [imagenes, setImagenes] = useState([]);
    const [preview, setPreview] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [precioOriginal, setPrecioOriginal] = useState('');
    const [esNuevo, setEsNuevo] = useState(false);
    const [enOferta, setEnOferta] = useState(false);
    const [imagen, setImagen] = useState(null);
    const navigate = useNavigate();

    const handleImagenChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImagen(e.target.files[0]);
        }
    };

    // Prevenir entrada de decimales en precio
    const handlePrecioChange = (e) => {
        const valor = e.target.value.replace(/[.,]/g, ''); // Eliminar puntos y comas
        setPrecio(valor);
    };

    // Prevenir entrada de decimales en precio original
    const handlePrecioOriginalChange = (e) => {
        const valor = e.target.value.replace(/[.,]/g, ''); // Eliminar puntos y comas
        setPrecioOriginal(valor);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validar campos
        if (!nombre || !precio || !stock || !categoria) {
            setError('Por favor completa todos los campos obligatorios.');
            return;
        }

        // Validar que precio no tenga decimales
        if (precio.includes('.') || precio.includes(',')) {
            setError('El precio no puede tener decimales. Solo se permiten números enteros.');
            return;
        }

        // Validar que precio sea un número entero positivo
        const precioNum = parseFloat(precio);
        if (!Number.isInteger(precioNum) || precioNum <= 0) {
            setError('El precio debe ser un número entero positivo.');
            return;
        }

        // Validar que precioOriginal no tenga decimales si está ingresado
        if (precioOriginal) {
            if (precioOriginal.includes('.') || precioOriginal.includes(',')) {
                setError('El precio original no puede tener decimales. Solo se permiten números enteros.');
                return;
            }

            const precioOriginalNum = parseFloat(precioOriginal);
            if (!Number.isInteger(precioOriginalNum) || precioOriginalNum <= 0) {
                setError('El precio original debe ser un número entero positivo.');
                return;
            }
        }

        // Validar que stock sea un número entero
        if (!Number.isInteger(parseInt(stock)) || parseInt(stock) < 0) {
            setError('El stock debe ser un número entero sin decimales.');
            return;
        }

        if (!imagen) {
            setError('Debes seleccionar una imagen.');
            return;
        }

        setLoading(true);

        try {
            // Preparar datos del producto como JSON puro
            const productData = {
                nombre,
                descripcion,
                precio: parseFloat(precio),
                stock: parseInt(stock),
                categoria,
                estado,
                precioOriginal: precioOriginal ? parseFloat(precioOriginal) : null,
                esNuevo,
                enOferta,
                imagenesUrl: [], // Se agregará la imagen del servidor
            };

            // Crear el producto (sin imagen en esta solicitud)
            // Si el backend requiere imagen, necesitarías endpoint separado
            await productService.create(productData);

            alert('¡Producto creado exitosamente!');
            navigate('/admin/products');
        } catch (err) {
            console.error('Error al guardar el producto:', err);
            const errorMessage = typeof err === 'string' ? err : err.message || 'Error al guardar el producto.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-container">
            <h2>Crear Nuevo Producto</h2>
            <form onSubmit={handleSubmit}>
<<<<<<< HEAD
                {error && <p className="form-error">❌ {error}</p>}
                {success && <p className="form-success">{success}</p>}
                
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
=======
                {error && <p className="form-error">{error}</p>}

                <div className="form-group">
                    <label htmlFor="nombre">Nombre *</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
<<<<<<< HEAD
                    <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
=======
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
<<<<<<< HEAD
                        <label htmlFor="precio">Precio Final (Oferta)</label>
                        <input type="number" id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required step="0.01" min="0"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="precioOriginal">Precio Original (Tachado)</label>
                        <input type="number" id="precioOriginal" value={precioOriginal} onChange={(e) => setPrecioOriginal(e.target.value)} step="0.01" min="0"/>
=======
                        <label htmlFor="precio">Precio Final * (números enteros)</label>
                        <input
                            type="number"
                            id="precio"
                            value={precio}
                            onChange={handlePrecioChange}
                            required
                            step="1"
                            min="0"
                            placeholder="Ej: 50000"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="precioOriginal">Precio Original (números enteros)</label>
                        <input
                            type="number"
                            id="precioOriginal"
                            value={precioOriginal}
                            onChange={handlePrecioOriginalChange}
                            step="1"
                            min="0"
                            placeholder="Ej: 60000"
                        />
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
                    </div>
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
<<<<<<< HEAD
                        <label htmlFor="stock">Stock</label>
                        <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required min="0"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoria">Categoría</label>
                        <input type="text" id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
=======
                        <label htmlFor="stock">Stock *</label>
                        <input
                            type="number"
                            id="stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoria">Categoría *</label>
                        <input
                            type="text"
                            id="categoria"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            required
                        />
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="estado">Estado</label>
<<<<<<< HEAD
                    <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
=======
                    <select
                        id="estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

                <div className="form-group">
<<<<<<< HEAD
                    <label htmlFor="imagenes">
                        Imágenes del Producto <span className="required">(Exactamente 3 imágenes)</span>
                    </label>
                    <input 
                        type="file" 
                        id="imagenes" 
                        onChange={handleImagenesChange} 
                        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                        multiple
                        required 
                    />
                    <p className="info-text">Formatos permitidos: JPEG, PNG, GIF, WebP, AVIF (Máximo 10MB cada una)</p>
                    <p className="info-text">Imágenes seleccionadas: <strong>{imagenes.length}/3</strong></p>
                </div>

                {/* Vista previa de imágenes */}
                {preview.length > 0 && (
                    <div className="images-preview">
                        <h3>Vista Previa ({preview.length}/3)</h3>
                        <div className="preview-grid">
                            {preview.map((img, index) => (
                                <div key={index} className="preview-item">
                                    <img src={img.url} alt={`Preview ${index + 1}`} />
                                    <div className="preview-info">
                                        <p className="preview-name">{img.name}</p>
                                        <p className="preview-size">{(img.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="btn-remove"
                                        onClick={() => removeImage(index)}
                                        disabled={uploadingImages}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="form-group-inline">
                    <div className="form-check">
                        <input type="checkbox" id="esNuevo" checked={esNuevo} onChange={(e) => setEsNuevo(e.target.checked)} />
                        <label htmlFor="esNuevo">Marcar como "Nuevo"</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" id="enOferta" checked={enOferta} onChange={(e) => setEnOferta(e.target.checked)} />
=======
                    <label htmlFor="imagen">Imagen del Producto *</label>
                    <input
                        type="file"
                        id="imagen"
                        onChange={handleImagenChange}
                        accept="image/*"
                        required
                    />
                </div>

                <div className="form-group-inline">
                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="esNuevo"
                            checked={esNuevo}
                            onChange={(e) => setEsNuevo(e.target.checked)}
                        />
                        <label htmlFor="esNuevo">Marcar como "Nuevo"</label>
                    </div>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="enOferta"
                            checked={enOferta}
                            onChange={(e) => setEnOferta(e.target.checked)}
                        />
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
                        <label htmlFor="enOferta">Marcar como "Oferta"</label>
                    </div>
                </div>

<<<<<<< HEAD
                <button 
                    type="submit" 
                    disabled={loading || uploadingImages || imagenes.length !== 3} 
                    className="btn-submit"
                >
                    {loading ? 'Guardando...' : uploadingImages ? 'Subiendo imágenes...' : 'Crear Producto'}
=======
                <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? 'Guardando...' : 'Crear Producto'}
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
                </button>
            </form>
        </div>
    );
};