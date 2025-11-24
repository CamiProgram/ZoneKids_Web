import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    const [uploadingImages, setUploadingImages] = useState(false);
    const navigate = useNavigate();
    const [precioOriginal, setPrecioOriginal] = useState('');
    const [esNuevo, setEsNuevo] = useState(false);
    const [enOferta, setEnOferta] = useState(false);

    const handleImagenesChange = (e) => {
        const files = Array.from(e.target.files || []);
        
        if (files.length > 3) {
            setError('Máximo 3 imágenes permitidas');
            return;
        }

        setImagenes(files);
        
        // Crear previsualizaciones
        const previews = files.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
            size: file.size
        }));
        setPreview(previews);
        setError('');
    };

    const removeImage = (index) => {
        const newImagenes = imagenes.filter((_, i) => i !== index);
        const newPreview = preview.filter((_, i) => i !== index);
        setImagenes(newImagenes);
        setPreview(newPreview);
    };

    const uploadImages = async () => {
        if (imagenes.length === 0) {
            setError('Debes seleccionar al menos 1 imagen');
            return;
        }

        if (imagenes.length !== 3) {
            setError('Debes seleccionar exactamente 3 imágenes para el producto');
            return;
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

            if (response.data.success && response.data.urls && response.data.urls.length === 3) {
                setSuccess(`✅ ${response.data.message || 'Las 3 imágenes se subieron correctamente'}`);
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (imagenes.length !== 3) {
            setError('Debes seleccionar exactamente 3 imágenes para el producto');
            setLoading(false);
            return;
        }

        try {
            // Primero subir las imágenes
            setUploadingImages(true);
            const imageUrls = await uploadImages();
            setUploadingImages(false);

            if (!imageUrls) {
                setLoading(false);
                return;
            }

            // Luego crear el producto con las URLs de las imágenes
            const productData = {
                nombre,
                descripcion,
                precio: parseFloat(precio),
                stock: parseInt(stock),
                categoria,
                estado,
                precioOriginal: precioOriginal ? parseFloat(precioOriginal) : null,
                esNuevo: esNuevo,
                enOferta: enOferta,
                imagenes: imageUrls
            };

            await axios.post('http://localhost:8080/api/v1/productos', productData);
            setSuccess('✅ Producto creado exitosamente');
            setTimeout(() => navigate('/admin/products'), 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al guardar el producto';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-container">
            <h2>Crear Nuevo Producto</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="form-error">❌ {error}</p>}
                {success && <p className="form-success">{success}</p>}
                
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
                        <label htmlFor="precio">Precio Final (Oferta)</label>
                        <input type="number" id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required step="0.01" min="0"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="precioOriginal">Precio Original (Tachado)</label>
                        <input type="number" id="precioOriginal" value={precioOriginal} onChange={(e) => setPrecioOriginal(e.target.value)} step="0.01" min="0"/>
                    </div>
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
                        <label htmlFor="stock">Stock</label>
                        <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required min="0"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoria">Categoría</label>
                        <input type="text" id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

                <div className="form-group">
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
                        <label htmlFor="enOferta">Marcar como "Oferta"</label>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading || uploadingImages || imagenes.length !== 3} 
                    className="btn-submit"
                >
                    {loading ? 'Guardando...' : uploadingImages ? 'Subiendo imágenes...' : 'Crear Producto'}
                </button>
            </form>
        </div>
    );
};