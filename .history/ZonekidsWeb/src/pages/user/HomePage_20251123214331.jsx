import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from '../../components/ProductCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import '../../styles/pages/homePage.css';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try { 
        setLoading(true); setError(null);
        const response = await axios.get('http://localhost:8080/api/v1/productos');
        setProducts(response.data);
        
        // Extrae categorías únicas de los productos
        const uniqueCategories = [...new Set(response.data.map(p => p.categoria).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("No se pudieron cargar los productos. Intenta más tarde.");
      } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory ? products.filter(p => p.categoria === selectedCategory) : products;

  // Carrusel de categorías - mostrar máximo 5 categorías a la vez
  const categoriesToShow = 5;
  const visibleCategories = categories.slice(carouselIndex, carouselIndex + categoriesToShow);

  const handleNextCategory = () => {
    if (carouselIndex + categoriesToShow < categories.length) {
      setCarouselIndex(carouselIndex + 1);
    }
  };

  const handlePrevCategory = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="homepage-container">
      <div className="home-content-wrapper">
        <div className="home-left-ad">
          <span>Espacio para<br/>Anuncio</span>
        </div>

        <div className="home-main-content">
          {/* --- CARRUSEL DE CATEGORÍAS --- */}
          {categories.length > 0 && (
            <div className="category-carousel-container">
              <button 
                className="carousel-arrow prev-arrow" 
                onClick={handlePrevCategory}
                disabled={carouselIndex === 0}
                aria-label="Categoría anterior"
              >
                ‹
              </button>

              <div className="category-filter-list">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? 'active' : ''}
                >
                  Todos
                </button>
                {visibleCategories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? 'active' : ''}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button 
                className="carousel-arrow next-arrow" 
                onClick={handleNextCategory}
                disabled={carouselIndex + categoriesToShow >= categories.length}
                aria-label="Siguiente categoría"
              >
                ›
              </button>
            </div>
          )}

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
          <span>Espacio para<br/>Anuncio</span>
        </div>
      </div>
    </div>
  );
};