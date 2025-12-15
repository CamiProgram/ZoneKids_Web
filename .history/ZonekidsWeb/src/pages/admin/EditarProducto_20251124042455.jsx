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
    const [imagenes, setImagenes] = useState([null, null, null]);
    const [previews, setPreviews] = useState(['', '', '']);
    const [imagenesActuales, setImagenesActuales] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [precioOriginal, setPrecioOriginal] = useState('');
    const [esNuevo, setEsNuevo] = useState(false);
    const [enOferta, setEnOferta] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const product = await productService.getById(id);
                setNombre(product.nombre);
                setDescripcion(product.descripcion || '');
                setPrecio(product.precio.toString());
                setStock(product.stock.toString());
                setCategoria(product.categoria || '');
                setImagenesActuales(product.imagenesUrl || []);
                setPrecioOriginal(product.precioOriginal ? product.precioOriginal.toString() : '');
                setEsNuevo(product.esNuevo || false);
                setEnOferta(product.enOferta || false);

                // Inicializar previews con imágenes actuales
                const newPreviews = ['', '', ''];
                const newImagenes = [null, null, null];
                if (product.imagenesUrl && product.imagenesUrl.length > 0) {
                    product.imagenesUrl.forEach((url, idx) => {
                        if (idx < 3) {
                            newPreviews[idx] = url;
                        }
                    });
                }
                setPreviews(newPreviews);
                setImagenes(newImagenes);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('No se pudo cargar el producto.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleImagenChange = (e, index) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newImagenes = [...imagenes];
            newImagenes[index] = file;
            setImagenes(newImagenes);

            const reader = new FileReader();
            reader.onloadend = () => {
                const newPreviews = [...previews];
                newPreviews[index] = reader.result;
                setPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImagen = (index) => {
        const newImagenes = [...imagenes];
        newImagenes[index] = null;
        setImagenes(newImagenes);

        const newPreviews = [...previews];
        newPreviews[index] = '';
        setPreviews(newPreviews);
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

        // Validar que se hayan subido al menos imágenes para reemplazar o mantener las actuales
        const newImagesCount = imagenes.filter(img => img !== null).length;
        const currentImagesCount = previews.filter(p => p && p.startsWith('data:') === false).length;
        
        if (newImagesCount + currentImagesCount === 0) {
            setError('Debes tener al menos imágenes. Puedes mantener las actuales o subir nuevas.');
            return;
        }

        setLoading(true);

        try {
            // Obtener las imágenes finales (nuevas + actuales)
            const newImagesCount = imagenes.filter(img => img !== null).length;
            let finalImagenesUrl = [];

            // Si hay nuevas imágenes, subirlas
            if (newImagesCount > 0) {
                const imagenesSubidas = await productService.uploadImages(imagenes);
                if (imagenesSubidas && imagenesSubidas.length > 0) {
                    finalImagenesUrl = imagenesSubidas;
                }
            } else {
                // Si no hay nuevas imágenes, usar las actuales
                finalImagenesUrl = previews.filter(p => p && !p.startsWith('data:'));
            }

            // Validar que haya al menos 2 imágenes
            if (finalImagenesUrl.length < 2) {
                setError('Debes tener al menos 2 imágenes. Carga nuevas o mantén las actuales.');
                setLoading(false);
                return;
            }

            // Paso 1: Actualizar datos del producto
            const productData = {
                nombre,
                descripcion,
                precio: parseInt(precio),
                stock: parseInt(stock),
                categoria,
                precioOriginal: precioOriginal ? parseInt(precioOriginal) : null,
                esNuevo,
                enOferta,
                imagenesUrl: finalImagenesUrl,
            };

            console.log('📦 Enviando datos del producto:', productData);
            
            await productService.update(id, productData);

            // Paso 2: Si hay nuevas imágenes, actualizar también con PATCH
            if (newImagesCount > 0) {
                await productService.updateImages(id, finalImagenesUrl);
            }

            alert('¡Producto actualizado exitosamente!');
            navigate('/admin/products');
        } catch (err) {
            console.error('❌ Error al actualizar el producto:', err);
            console.error('Error response data:', err.response?.data);
            console.error('Error status:', err.response?.status);
            console.error('Error message:', err.message);
            
            const errorMessage = typeof err === 'string' ? err : err.message || 'Error al actualizar el producto.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="admin-form-container">
            <h2>Editar Producto (ID: {id})</h2>
            <form onSubmit={handleSubmit}>
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
                </div>

                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
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
                    </div>
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
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
                    </div>
                </div>

                <div className="form-group">
                    <label>Imágenes del Producto (Sube o reemplaza imágenes)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '10px' }}>
                        {[0, 1, 2].map((index) => (
                            <div key={index} style={{
                                border: '2px dashed #ccc',
                                borderRadius: '8px',
                                padding: '15px',
                                textAlign: 'center',
                                backgroundColor: previews[index] ? '#f0f0f0' : '#fafafa'
                            }}>
                                {previews[index] ? (
                                    <div>
                                        <img
                                            src={previews[index]}
                                            alt={`Preview ${index + 1}`}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '150px',
                                                marginBottom: '10px',
                                                borderRadius: '4px'
                                            }}
                                        />
                                        <p style={{ margin: '8px 0', fontSize: '12px', color: '#666' }}>
                                            {imagenes[index]?.name || `Imagen actual ${index + 1}`}
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <input
                                                type="file"
                                                id={`imagen-reemplazar-${index}`}
                                                onChange={(e) => handleImagenChange(e, index)}
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                            />
                                            <label htmlFor={`imagen-reemplazar-${index}`} style={{
                                                display: 'inline-block',
                                                padding: '6px 12px',
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                🔄 Cambiar
                                            </label>
                                            {imagenes[index] && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeImagen(index)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    ✕ Cancelar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p style={{ margin: '20px 0', color: '#999', fontSize: '14px' }}>📸 Imagen {index + 1}</p>
                                        <input
                                            type="file"
                                            id={`imagen-${index}`}
                                            onChange={(e) => handleImagenChange(e, index)}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor={`imagen-${index}`} style={{
                                            display: 'inline-block',
                                            padding: '10px 20px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500'
                                        }}>
                                            📁 Seleccionar Imagen
                                        </label>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        Imágenes actuales: {previews.filter(p => p && !p.startsWith('data:')).length} | Nuevas imágenes: {imagenes.filter(img => img !== null).length}
                    </p>
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
                        <label htmlFor="enOferta">Marcar como "Oferta"</label>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? 'Actualizando...' : 'Actualizar Producto'}
                </button>
            </form>
        </div>
    );
};