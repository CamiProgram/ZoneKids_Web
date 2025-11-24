import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ProductCard } from '../../components/ProductCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import '../../styles/pages/categoryPage.css';

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:8080/api/v1/productos');
        // Filtrar por categoría y que estén activos
        const filtered = response.data.filter(p => p.categoria === categoryName && p.estado === 'activo');
        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("No se pudieron cargar los productos de esta categoría.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="category-page-container">
      <div className="category-page-wrapper">
        <div className="category-left-ad">
          <span>Espacio para<br/>Anuncio</span>
        </div>

        <div className="category-main-content">
          <h2 className="category-title">Categoría: {categoryName}</h2>

          {products.length > 0 ? (
            <div className="category-products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="no-products-message">No hay productos disponibles en esta categoría.</p>
          )}
        </div>

        <div className="category-right-ad">
          <span>Espacio para<br/>Anuncio</span>
        </div>
      </div>
    </div>
  );
};
