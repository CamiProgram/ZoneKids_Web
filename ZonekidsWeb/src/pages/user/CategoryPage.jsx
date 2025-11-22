import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard';
import '../../styles/pages/categoryPage.css';

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de carga de productos (temporal, hasta conectar con backend)
    setTimeout(() => {
      setProducts([
        { id: 1, name: `Producto 1 de ${categoryName}`, price: 19990, image: '/assets/product-placeholder.jpg' },
        { id: 2, name: `Producto 2 de ${categoryName}`, price: 29990, image: '/assets/product-placeholder.jpg' },
        { id: 3, name: `Producto 3 de ${categoryName}`, price: 39990, image: '/assets/product-placeholder.jpg' },
      ]);
      setLoading(false);
    }, 1000);
  }, [categoryName]);

  if (loading) return <div className="loading-message">Cargando productos de {categoryName}...</div>;

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
