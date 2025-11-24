import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LoadingSpinner } from './LoadingSpinner';
import '../styles/components/navbar.css';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      closeMobileMenu();
      // Reseteamos el estado de búsqueda después de la navegación
      setTimeout(() => setIsSearching(false), 1000);
    }
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

        <form className="search-bar desktop-search" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching ? (
            <LoadingSpinner />
          ) : (
            <button type="submit" aria-label="Buscar">🔍</button>
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