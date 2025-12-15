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
    const [imagen, setImagen] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [precioOriginal, setPrecioOriginal] = useState('');
    const [esNuevo, setEsNuevo] = useState(false);
    const [enOferta, setEnOferta] = useState(false);
    const navigate = useNavigate();

    const handleImagenChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImagen(e.target.files[0]);
        }
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
            const formData = new FormData();

            // Preparar datos del producto
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

            formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
            formData.append('file', imagen);

            // Crear el producto
            await productService.create(formData);

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
                            onChange={(e) => setPrecio(e.target.value)}
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
                            onChange={(e) => setPrecioOriginal(e.target.value)}
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
                        <label htmlFor="enOferta">Marcar como "Oferta"</label>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? 'Guardando...' : 'Crear Producto'}
                </button>
            </form>
        </div>
    );
};