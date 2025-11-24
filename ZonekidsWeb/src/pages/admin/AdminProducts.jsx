import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { productService } from '../../services/productService';
import '../../styles/pages/adminProducts.css';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [togglingStatus, setTogglingStatus] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📦 Cargando productos...');
      
      const data = await productService.getAll();
      console.log('✅ Productos cargados:', data?.length || 0);
      setProducts(data);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Mostrar mensajes de error específicos
      if (err.response?.status === 403) {
        setError('No tienes permisos para acceder a los productos. Verifica tu rol.');
      } else if (err.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError('Error al cargar productos. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productService.delete(id);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Error al eliminar el producto.');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';
    
    try {
      setTogglingStatus(id);
      await productService.updateStatus(id, newStatus);
      
      // Actualizar el producto en la lista inmediatamente
      const updatedProducts = products.map(p => 
        p.id === id ? { ...p, estado: newStatus } : p
      );
      setProducts(updatedProducts);
      
      // Pequeño delay para asegurar actualización visual
      setTimeout(() => {
        setTogglingStatus(null);
      }, 300);
    } catch (err) {
      console.error('Error toggling product status:', err);
      alert(`Error al cambiar el estado del producto: ${err.message || 'Intenta de nuevo'}`);
      setTogglingStatus(null);
    }
  };

  const filteredProducts = products
    .filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => selectedCategory === '' || p.categoria === selectedCategory);

  const categories = [...new Set(products.map(p => p.categoria).filter(Boolean))];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-table-container">
      <h2>Gestión de Productos</h2>
      <Link to="/admin/products/crear" className="btn-create-link">
        + Crear Producto
      </Link>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="admin-search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="admin-category-filter"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-responsive-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(p => (
                <tr key={p.id}>
                  <td data-label="ID">{p.id}</td>
                  <td data-label="Imagen">
                    {p.imagenesUrl && p.imagenesUrl.length > 0 ? (
                      <img 
                        src={
                          p.imagenesUrl[0].startsWith('http') 
                            ? p.imagenesUrl[0] 
                            : `http://localhost:8080${p.imagenesUrl[0].startsWith('/') ? '' : '/'}${p.imagenesUrl[0]}`
                        } 
                        alt={p.nombre} 
                        className="admin-product-image"
                        onError={(e) => {
                          console.error('❌ Error loading product image:', p.imagenesUrl[0]);
                          e.target.src = '/public/Zonekids_logo_web.webp';
                        }}
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td data-label="Nombre">{p.nombre}</td>
                  <td data-label="Precio">
                    ${p.precio ? p.precio.toLocaleString('es-CO') : 'N/A'}
                  </td>
                  <td data-label="Stock" className={p.stock <= 10 ? 'stock-low' : ''}>
                    {p.stock}
                  </td>
                  <td data-label="Categoría">{p.categoria || 'N/A'}</td>
                  <td data-label="Estado">
                    <span 
                      className={`status-badge ${p.estado}`}
                      onClick={() => handleToggleStatus(p.id, p.estado)}
                      style={{ cursor: 'pointer', opacity: togglingStatus === p.id ? 0.6 : 1 }}
                      title="Click para cambiar estado"
                    >
                      {togglingStatus === p.id ? '⏳ Cambiando...' : p.estado}
                    </span>
                  </td>
                  <td data-label="Acciones">
                    <Link to={`/admin/products/editar/${p.id}`} className="btn-edit">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn-delete"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};