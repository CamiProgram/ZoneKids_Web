import React, { useState, useEffect } from 'react';
import { ProductCard } from '../../components/ProductCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { productService } from '../../services/productService';
import '../../styles/pages/homePage.css';

export const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
<<<<<<< HEAD
      try { 
        setLoading(true); setError(null);
        const response = await axios.get('http://localhost:8080/api/v1/productos');
        setProducts(response.data);
        
=======
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getAll();
        setProducts(data);

>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
        // Extrae categorías únicas de los productos
        const uniqueCategories = [...new Set(data.map(p => p.categoria).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('No se pudieron cargar los productos. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoria === selectedCategory)
    : products;

  // Carrusel de categorías - desplazamiento suave
  const handleNextCategory = () => {
    const carousel = document.querySelector('.category-filter-list');
    if (carousel) {
      carousel.scrollLeft += 200; // Desplazar 200px a la derecha
    }
  };

  const handlePrevCategory = () => {
    const carousel = document.querySelector('.category-filter-list');
    if (carousel) {
      carousel.scrollLeft -= 200; // Desplazar 200px a la izquierda
    }
  };

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
<<<<<<< HEAD
          {/* --- CARRUSEL DE CATEGORÍAS --- */}
          {categories.length > 0 && (
            <div className="category-carousel-container">
              <button 
                className="carousel-arrow prev-arrow" 
                onClick={handlePrevCategory}
                aria-label="Categoría anterior"
=======
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
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
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

              <button 
                className="carousel-arrow next-arrow" 
                onClick={handleNextCategory}
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