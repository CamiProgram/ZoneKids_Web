import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { productService } from '../../services/productService';
import '../../styles/pages/editarProducto.css';

export const EditarProducto = () => {
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [categoria, setCategoria] = useState('');
    const [estado, setEstado] = useState('activo');
<<<<<<< HEAD
    const [imagenes, setImagenes] = useState([]);
    const [preview, setPreview] = useState([]);
    const [imagenesActuales, setImagenesActuales] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploadingImages, setUploadingImages] = useState(false);
    const navigate = useNavigate();
=======
    const [imagen, setImagen] = useState(null);
    const [imagenesActuales, setImagenesActuales] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
    const [precioOriginal, setPrecioOriginal] = useState('');
    const [esNuevo, setEsNuevo] = useState(false);
    const [enOferta, setEnOferta] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
<<<<<<< HEAD
                const response = await axios.get(`http://localhost:8080/api/v1/productos/${id}`);
                const product = response.data;
=======
                setLoading(true);
                setError(null);
                const product = await productService.getById(id);
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
                setNombre(product.nombre);
                setDescripcion(product.descripcion || '');
                setPrecio(product.precio.toString());
                setStock(product.stock.toString());
                setCategoria(product.categoria || '');
                setEstado(product.estado);
<<<<<<< HEAD
                setImagenesActuales(product.imagenes || []);
=======
                setImagenesActuales(product.imagenesUrl || []);
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
                setPrecioOriginal(product.precioOriginal ? product.precioOriginal.toString() : '');
                setEsNuevo(product.esNuevo || false);
                setEnOferta(product.enOferta || false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('No se pudo cargar el producto.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

<<<<<<< HEAD
    const handleImagenesChange = (e) => {
        const files = Array.from(e.target.files || []);
        
        if (files.length > 3) {
            setError('Máximo 3 imágenes permitidas');
            return;
        }

        setImagenes(files);
        
        const previews = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
            size: file.size,
            isNew: true
        }));
        setPreview(previews);
        setError('');
    };

    const removeNewImage = (index) => {
        const newImagenes = imagenes.filter((_, i) => i !== index);
        const newPreview = preview.filter((_, i) => i !== index);
        setImagenes(newImagenes);
        setPreview(newPreview);
    };

    const removeCurrentImage = (index) => {
        const newImagenes = imagenesActuales.filter((_, i) => i !== index);
        setImagenesActuales(newImagenes);
    };

    const uploadNewImages = async () => {
        if (imagenes.length === 0) {
            return null;
        }

        setUploadingImages(true);
        setError('');
        
        const formData = new FormData();
        imagenes.forEach((imagen) => {
            formData.append('files', imagen);
        });

        try {
            const response = await axios.post('http://localhost:8080/api/v1/upload/imagenes', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success && response.data.urls) {
                return response.data.urls;
            } else {
                setError('Error al subir las imágenes. Por favor intenta de nuevo.');
                return null;
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al subir las imágenes';
            setError(errorMsg);
            return null;
        } finally {
            setUploadingImages(false);
        }
=======
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
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
<<<<<<< HEAD
        setSuccess('');
        setLoading(true);

        const totalImages = imagenesActuales.length + imagenes.length;
        if (totalImages !== 3) {
            setError(`Debes tener exactamente 3 imágenes. Actualmente tienes ${totalImages}`);
            setLoading(false);
            return;
        }

        try {
            let allImageUrls = [...imagenesActuales];

            // Si hay nuevas imágenes, subirlas
            if (imagenes.length > 0) {
                setUploadingImages(true);
                const newUrls = await uploadNewImages();
                setUploadingImages(false);

                if (!newUrls) {
                    setLoading(false);
                    return;
                }
                allImageUrls = allImageUrls.concat(newUrls);
            }

=======

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

        setLoading(true);

        try {
            // Preparar datos del producto como JSON puro
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
            const productData = {
                nombre,
                descripcion,
                precio: parseFloat(precio),
                stock: parseInt(stock),
                categoria,
                estado,
                precioOriginal: precioOriginal ? parseFloat(precioOriginal) : null,
<<<<<<< HEAD
                esNuevo: esNuevo,
                enOferta: enOferta,
                imagenes: allImageUrls
            };

            await axios.put(`http://localhost:8080/api/v1/productos/${id}`, productData);
            setSuccess('✅ Producto actualizado exitosamente');
            setTimeout(() => navigate('/admin/products'), 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al actualizar el producto';
            setError(errorMsg);
=======
                esNuevo,
                enOferta,
                imagenesUrl: imagenesActuales, // Mantener imágenes actuales
            };

            // Actualizar el producto (sin archivo)
            // Si quieres agregar imagen, necesitarías endpoint separado
            await productService.update(id, productData);

            alert('¡Producto actualizado exitosamente!');
            navigate('/admin/products');
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            const errorMessage = typeof err === 'string' ? err : err.message || 'Error al actualizar el producto.';
            setError(errorMessage);
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    if (loading) return <LoadingSpinner />;
=======
    if (loading) {
        return <LoadingSpinner />;
    }
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d

    return (
        <div className="admin-form-container">
            <h2>Editar Producto (ID: {id})</h2>
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

<<<<<<< HEAD
                {/* Imágenes actuales */}
                {imagenesActuales.length > 0 && (
                    <div className="images-preview">
                        <h3>Imágenes Actuales ({imagenesActuales.length}/3)</h3>
                        <div className="preview-grid">
                            {imagenesActuales.map((url, index) => (
                                <div key={`current-${index}`} className="preview-item">
                                    <img src={url} alt={`Imagen actual ${index + 1}`} />
                                    <div className="preview-info">
                                        <p className="preview-name">Actual {index + 1}</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="btn-remove"
                                        onClick={() => removeCurrentImage(index)}
                                        disabled={uploadingImages}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Nuevas imágenes */}
                <div className="form-group">
                    <label htmlFor="imagenes">
                        Nuevas Imágenes <span className="info-text">(Opcional - Máximo 3 imágenes en total)</span>
                    </label>
                    <input 
                        type="file" 
                        id="imagenes" 
                        onChange={handleImagenesChange} 
                        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                        multiple
                    />
                    <p className="info-text">Formatos permitidos: JPEG, PNG, GIF, WebP, AVIF (Máximo 10MB cada una)</p>
                    <p className="info-text">Total de imágenes: <strong>{imagenesActuales.length + imagenes.length}/3</strong></p>
                </div>

                {/* Vista previa de nuevas imágenes */}
                {preview.length > 0 && (
                    <div className="images-preview">
                        <h3>Nuevas Imágenes ({preview.length})</h3>
                        <div className="preview-grid">
                            {preview.map((img, index) => (
                                <div key={`new-${index}`} className="preview-item">
                                    <img src={img.url} alt={`Nueva imagen ${index + 1}`} />
                                    <div className="preview-info">
                                        <p className="preview-name">{img.name}</p>
                                        <p className="preview-size">{(img.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="btn-remove"
                                        onClick={() => removeNewImage(index)}
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
                <div className="form-group">
                    <label>Imágenes Actuales</label>
                    {imagenesActuales && imagenesActuales.length > 0 ? (
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            {imagenesActuales.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Imagen ${idx}`}
                                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>Sin imágenes</p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="imagen">Cambiar Imagen (Opcional)</label>
                    <input
                        type="file"
                        id="imagen"
                        onChange={handleImagenChange}
                        accept="image/*"
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
                    disabled={loading || uploadingImages || (imagenesActuales.length + imagenes.length) !== 3} 
                    className="btn-submit"
                >
                    {loading ? 'Actualizando...' : uploadingImages ? 'Subiendo imágenes...' : 'Actualizar Producto'}
=======
                <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? 'Actualizando...' : 'Actualizar Producto'}
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
                </button>
            </form>
        </div>
    );
};