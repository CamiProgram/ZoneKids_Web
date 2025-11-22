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
    const [imagen, setImagen] = useState(null); 
    const [imagenActualUrl, setImagenActualUrl] = useState(''); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // Carga al inicio
    const navigate = useNavigate();
    const [precioOriginal, setPrecioOriginal] = useState('');
    const [esNuevo, setEsNuevo] = useState(false);
    const [enOferta, setEnOferta] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products/${id}`);
                const product = response.data;
                setNombre(product.nombre);
                setDescripcion(product.descripcion || '');
                setPrecio(product.precio.toString());
                setStock(product.stock.toString());
                setCategoria(product.categoria || '');
                setEstado(product.estado);
                setImagenActualUrl(product.imagenUrl || '');
                setPrecioOriginal(product.precioOriginal ? product.precioOriginal.toString() : '');
                setEsNuevo(product.esNuevo || false);
                setEnOferta(product.enOferta || false);
            } catch (err) { setError("No se pudo cargar el producto."); } 
            finally { setLoading(false); }
        };
        fetchProduct();
    }, [id]); 

    const handleImagenChange = (e) => { if (e.target.files && e.target.files[0]) { setImagen(e.target.files[0]); } };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        const formData = new FormData();
        const productData = { 
            nombre, descripcion, precio: parseFloat(precio), stock: parseInt(stock), 
            categoria, estado, imagenUrl: imagenActualUrl,
            precioOriginal: precioOriginal ? parseFloat(precioOriginal) : null,
            esNuevo: esNuevo, enOferta: enOferta
        }; 
        formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        if (imagen) { formData.append('file', imagen); }
        try {
            await axios.put(`http://localhost:8080/api/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate('/admin/products'); 
        } catch (err) { setError('Error al actualizar el producto.'); } 
        finally { setLoading(false); }
    };

    if (loading) return <LoadingSpinner />; // Spinner mientras carga datos iniciales

    return (
        <div className="admin-form-container">
            <h2>Editar Producto (ID: {id})</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="form-error">{error}</p>}
                <div className="form-group"><label htmlFor="nombre">Nombre</label><input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
                <div className="form-group"><label htmlFor="descripcion">Descripción</label><textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></div>
                <div className="form-group-inline">
                  <div className="form-group"><label htmlFor="precio">Precio Final (Oferta)</label><input type="number" id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required step="0.01" min="0"/></div>
                  <div className="form-group"><label htmlFor="precioOriginal">Precio Original (Tachado)</label><input type="number" id="precioOriginal" value={precioOriginal} onChange={(e) => setPrecioOriginal(e.target.value)} step="0.01" min="0"/></div>
                </div>
                <div className="form-group-inline">
                  <div className="form-group"><label htmlFor="stock">Stock</label><input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required min="0"/></div>
                  <div className="form-group"><label htmlFor="categoria">Categoría</label><input type="text" id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} /></div>
                </div>
                <div className="form-group"><label htmlFor="estado">Estado</label><select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></div>
                <div className="form-group"><label>Imagen Actual</label>{imagenActualUrl && <img src={imagenActualUrl} alt="Imagen actual" style={{maxWidth: '100px', marginBottom: '10px'}}/>}<label htmlFor="imagen">Cambiar Imagen (Opcional)</label><input type="file" id="imagen" onChange={handleImagenChange} accept="image/*" /></div>
                <div className="form-group-inline">
                    <div className="form-check"><input type="checkbox" id="esNuevo" checked={esNuevo} onChange={(e) => setEsNuevo(e.target.checked)} /><label htmlFor="esNuevo">Marcar como "Nuevo"</label></div>
                    <div className="form-check"><input type="checkbox" id="enOferta" checked={enOferta} onChange={(e) => setEnOferta(e.target.checked)} /><label htmlFor="enOferta">Marcar como "Oferta"</label></div>
                </div>
                <button type="submit" disabled={loading} className="btn-submit">{loading ? 'Actualizando...' : 'Actualizar Producto'}</button>
            </form>
        </div>
    );
};