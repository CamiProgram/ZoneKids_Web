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
    const [imagenes, setImagenes] = useState([null, null, null]);
    const [previews, setPreviews] = useState(['', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [precioOriginal, setPrecioOriginal] = useState('');
    const [esNuevo, setEsNuevo] = useState(false);
    const [enOferta, setEnOferta] = useState(false);
    const navigate = useNavigate();

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

        // Validar que se hayan subido 3 imágenes
        if (imagenes.filter(img => img !== null).length !== 3) {
            setError('Debes subir exactamente 3 imágenes.');
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
            // Paso 1: Subir imágenes
            const imagenesSubidas = await productService.uploadImages(imagenes);
            
            if (!imagenesSubidas || imagenesSubidas.length === 0) {
                setError('Error al subir las imágenes. Intenta nuevamente.');
                setLoading(false);
                return;
            }

            // Paso 2: Crear el producto sin imágenes
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
                imagenesUrl: [],
            };

            const productoCreado = await productService.create(productData);

            // Paso 3: Actualizar imágenes del producto creado
            if (productoCreado && productoCreado.id) {
                await productService.updateImages(productoCreado.id, imagenesSubidas);
            }

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
                    <label htmlFor="estado">Estado</label>
                    <select
                        id="estado"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Imágenes del Producto * (Sube exactamente 3 imágenes)</label>
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
                                            {imagenes[index]?.name}
                                        </p>
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
                                            ✕ Eliminar
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p style={{ margin: '20px 0', color: '#999', fontSize: '14px' }}>📸 Imagen {index + 1}</p>
                                        <input
                                            type="file"
                                            id={`imagen-crear-${index}`}
                                            onChange={(e) => handleImagenChange(e, index)}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor={`imagen-crear-${index}`} style={{
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
                        Imágenes subidas: {imagenes.filter(img => img !== null).length} / 3
                    </p>
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
                        <label htmlFor="esNuevo">
                            <input
                                type="checkbox"
                                id="esNuevo"
                                checked={esNuevo}
                                onChange={(e) => setEsNuevo(e.target.checked)}
                            />
                            Marcar como "Nuevo"
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="enOferta">
                            <input
                                type="checkbox"
                                id="enOferta"
                                checked={enOferta}
                                onChange={(e) => setEnOferta(e.target.checked)}
                            />
                            Marcar como "Oferta"
                        </label>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? 'Guardando...' : 'Crear Producto'}
                </button>
            </form>
        </div>
    );
};