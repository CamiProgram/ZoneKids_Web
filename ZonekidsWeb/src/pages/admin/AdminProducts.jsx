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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar productos.');
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
                      <img src={p.imagenesUrl[0]} alt={p.nombre} className="admin-product-image" />
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
                    <span className={`status-badge ${p.estado}`}>{p.estado}</span>
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