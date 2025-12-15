import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ProductCard } from '../../components/ProductCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import '../../styles/pages/searchPage.css';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  // Efecto para obtener todos los productos al cargar la página
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/v1/productos');
        // Filtra solo productos válidos y activos
        const validProducts = (response.data || []).filter(product => 
          product && product.id && product.nombre && product.precio !== undefined && product.estado === 'activo'
        );
        setProducts(validProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar los productos. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Efecto para manejar la búsqueda desde la URL
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Efecto para filtrar productos en tiempo real
  useEffect(() => {
    // Limpia el timer anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (!searchTerm.trim()) {
        setFilteredProducts([]);
        return;
      }

      const query = searchTerm.toLowerCase().trim();
      const filtered = products.filter(product => {
        // Verifica que el producto tenga datos válidos
        if (!product || !product.nombre || !product.precio) {
          return false;
        }

        const nombre = (product.nombre || '').toLowerCase();
        const descripcion = (product.descripcion || '').toLowerCase();
        const categoria = (product.categoria || '').toLowerCase();

        return (
          nombre.includes(query) ||
          descripcion.includes(query) ||
          categoria.includes(query)
        );
      });

      setFilteredProducts(filtered);
    }, 300); // Debounce de 300ms

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  return (
    <div className="search-page-container">
      <div className="search-page-wrapper">
        <div className="search-left-ad">
          <span>Espacio para<br/>Anuncio</span>
        </div>

        <div className="search-main-content">
          <h2>Buscar productos</h2>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="search-results">
              {searchTerm.trim() && filteredProducts.length > 0 ? (
                <>
                  <p className="results-count">Se encontraron {filteredProducts.length} producto(s)</p>
                  <div className="results-grid">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : searchTerm.trim() ? (
                <p className="no-results">No se encontraron productos para "{searchTerm}".</p>
              ) : (
                <p className="no-search">Ingresa un término de búsqueda para comenzar.</p>
              )}
            </div>
          )}
        </div>

        <div className="search-right-ad">
          <span>Espacio para<br/>Anuncio</span>
        </div>
      </div>
    </div>
  );
};
