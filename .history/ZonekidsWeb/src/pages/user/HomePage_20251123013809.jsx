import React, { useState, useEffect } from 'react';
import { ProductCard } from '../../components/ProductCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { productService } from '../../services/productService';
import { getSampleProducts, loadSampleProductsIfNeeded } from '../../utils/seedProducts';
import '../../styles/pages/homePage.css';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getAll();
        
        // Si no hay productos del backend, cargar de prueba
        let productsToUse = data;
        if (!data || data.length === 0) {
          loadSampleProductsIfNeeded();
          productsToUse = getSampleProducts();
        }
        
        setProducts(productsToUse);

        // Extrae categorías únicas de los productos
        const uniqueCategories = [...new Set(productsToUse.map(p => p.categoria).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Si hay error, intentar cargar productos de prueba
        loadSampleProductsIfNeeded();
        const sampleProducts = getSampleProducts();
        setProducts(sampleProducts);
        const uniqueCategories = [...new Set(sampleProducts.map(p => p.categoria).filter(Boolean))];
        setCategories(uniqueCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoria === selectedCategory)
    : products;

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="homepage-container">
      <div className="home-content-wrapper">
        <div className="home-left-ad">
          <span>
            Espacio para
            <br />
            Anuncio
          </span>
        </div>

        <div className="home-main-content">
          {/* --- LISTA DE CATEGORÍAS --- */}
          <div className="category-filter-list">
            <button
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? 'active' : ''}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'active' : ''}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* --- GRILLA DE PRODUCTOS --- */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p>No hay productos disponibles para esta categoría.</p>
          )}
        </div>

        <div className="home-right-ad">
          <span>
            Espacio para
            <br />
            Anuncio
          </span>
        </div>
      </div>
    </div>
  );
};