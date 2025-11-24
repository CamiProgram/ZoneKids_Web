import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/pages/editarProducto.css'; 
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const EditarProducto = () => {
    const { id } = useParams(); 
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [categoria, setCategoria] = useState('');
    const [estado, setEstado] = useState('activo');
    const [imagenes, setImagenes] = useState([]);
    const [preview, setPreview] = useState([]);
    const [imagenesActuales, setImagenesActuales] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploadingImages, setUploadingImages] = useState(false);
    const navigate = useNavigate();
    const [precioOriginal, setPrecioOriginal] = useState('');
    const [esNuevo, setEsNuevo] = useState(false);
    const [enOferta, setEnOferta] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/productos/${id}`);
                const product = response.data;
                setNombre(product.nombre);
                setDescripcion(product.descripcion || '');
                setPrecio(product.precio.toString());
                setStock(product.stock.toString());
                setCategoria(product.categoria || '');
                setEstado(product.estado);
                setImagenesActuales(product.imagenes || []);
                setPrecioOriginal(product.precioOriginal ? product.precioOriginal.toString() : '');
                setEsNuevo(product.esNuevo || false);
                setEnOferta(product.enOferta || false);
            } catch (err) { setError("No se pudo cargar el producto."); } 
            finally { setLoading(false); }
        };
        fetchProduct();
    }, [id]);

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
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
                imagenes: allImageUrls
            };

            await axios.put(`http://localhost:8080/api/v1/productos/${id}`, productData);
            setSuccess('✅ Producto actualizado exitosamente');
            setTimeout(() => navigate('/admin/products'), 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error al actualizar el producto';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-form-container">
            <h2>Editar Producto (ID: {id})</h2>
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
                        <label htmlFor="enOferta">Marcar como "Oferta"</label>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading || uploadingImages || (imagenesActuales.length + imagenes.length) !== 3} 
                    className="btn-submit"
                >
                    {loading ? 'Actualizando...' : uploadingImages ? 'Subiendo imágenes...' : 'Actualizar Producto'}
                </button>
            </form>
        </div>
    );
};