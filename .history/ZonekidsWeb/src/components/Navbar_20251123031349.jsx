import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import { LoadingSpinner } from './LoadingSpinner';
import '../styles/components/navbar.css';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Cargar todos los productos al montar el componente
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await productService.getAll();
        setAllProducts(products);
      } catch (err) {
        console.error('Error loading products for search:', err);
      }
    };
    loadProducts();
  }, []);

  // Búsqueda en tiempo real
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      const results = allProducts.filter(product => 
        product.nombre.toLowerCase().includes(query) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(query)) ||
        (product.categoria && product.categoria.toLowerCase().includes(query))
      ).slice(0, 5); // Mostrar máximo 5 resultados
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, allProducts]);

  // Cerrar resultados al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowResults(false);
      closeMobileMenu();
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`);
    setSearchQuery('');
    setShowResults(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <nav className="navbar-container">
      <div className="navbar-top">
        <NavLink to="/" className="logo">
          <img src="/public/Zonekids_logo_web.webp" alt="ZoneKids Logo" className="logo-image" />
        </NavLink>

        <form className="search-bar desktop-search" onSubmit={handleSearch} ref={searchRef}>
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim().length > 0 && setShowResults(true)}
          />
          {isSearching ? (
            <LoadingSpinner />
          ) : (
            <button type="submit" aria-label="Buscar">🔍</button>
          )}
          
          {/* Dropdown de resultados en tiempo real */}
          {showResults && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map(product => (
                <div 
                  key={product.id} 
                  className="search-result-item"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img src={product.imagenesUrl?.[0] || '/public/Zonekids_logo_web.webp'} alt={product.nombre} />
                  <div className="result-info">
                    <p className="result-name">{product.nombre}</p>
                    <p className="result-price">${product.precio.toLocaleString('es-CO')}</p>
                  </div>
                </div>
              ))}
              <div className="search-result-footer">
                <button onClick={handleSearch} className="view-all-btn">
                  Ver todos los resultados
                </button>
              </div>
            </div>
          )}
          {showResults && searchQuery.trim().length > 0 && searchResults.length === 0 && (
            <div className="search-results-dropdown">
              <p className="no-results">No se encontraron productos</p>
            </div>
          )}
        </form>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          ☰
        </button>

        {/* Saludo + Iconos a la derecha */}
        <div className="navbar-right">
          <div className="navbar-greeting">
            {user ? (
              <span>¡Hola, {user.nombre}!</span>
            ) : (
              <span>Bienvenido</span>
            )}
          </div>

          {/* Iconos */}
          <div className="user-actions desktop-actions">
          {user && user.rol === 'ADMIN' && (
            <NavLink to="/admin" className="icon-button" title="Panel de Admin">
              ⚙️
            </NavLink>
          )}
          
          {user && (
            <NavLink to="/historial" className="icon-button" title="Historial de compras">
              📋
            </NavLink>
          )}
          
          {user ? (
            <a onClick={logout} className="icon-button" title="Cerrar sesión">
              🚪
            </a>
          ) : (
            <NavLink to="/login" className="icon-button" title="Iniciar sesión">
              👤
            </NavLink>
          )}
          
          <a onClick={openCart} className="icon-button cart-icon" title="Carrito">
            🛒
          </a> 
        </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <form className="search-bar mobile-search" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Buscar">🔍</button>
          </form>
          <div className="mobile-actions">
            {user && user.rol === 'ADMIN' && (
              <NavLink to="/admin" onClick={closeMobileMenu} className="mobile-action-item">
                ⚙️ Panel de Admin
              </NavLink>
            )}
            
            {user && (
              <NavLink to="/historial" onClick={closeMobileMenu} className="mobile-action-item">
                📋 Historial
              </NavLink>
            )}
            
            {user ? (
              <a onClick={() => { logout(); closeMobileMenu(); }} className="mobile-action-item">
                🚪 Salir
              </a>
            ) : (
              <NavLink to="/login" onClick={closeMobileMenu} className="mobile-action-item">
                👤 Cuenta
              </NavLink>
            )}
            
            <a onClick={() => { openCart(); closeMobileMenu(); }} className="mobile-action-item">
              🛒 Carrito
            </a> 
          </div>
        </div>
      )}

      <div className="navbar-promo">
        <h1>¡Día nuevo, descuentos nuevos! 40% Desc 🌟</h1>
      </div>
    </nav>
  );
};