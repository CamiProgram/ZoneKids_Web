import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard';
import { productService } from '../../services/productService';
import { getSampleProducts, loadSampleProductsIfNeeded } from '../../utils/seedProducts';
import '../../styles/pages/categoryPage.css';

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await productService.getAll();
        
        // Si no hay productos del backend, cargar de prueba
        let productsToUse = allProducts;
        if (!allProducts || allProducts.length === 0) {
          loadSampleProductsIfNeeded();
          productsToUse = getSampleProducts();
        }
        
        // Filtrar por categoría
        const filtered = productsToUse.filter(p => p.categoria === categoryName);
        setProducts(filtered);
      } catch (err) {
        console.error('Error fetching category products:', err);
        // Si hay error, cargar de prueba
        loadSampleProductsIfNeeded();
        const sampleProducts = getSampleProducts();
        const filtered = sampleProducts.filter(p => p.categoria === categoryName);
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
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
