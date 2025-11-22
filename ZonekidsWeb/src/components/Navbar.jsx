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

        <div className="user-actions desktop-actions">
          {user ? (
            <>
              <span>¡Hola, {user.nombre}!</span>
              {user.rol === 'super-admin' && <NavLink to="/admin">Panel</NavLink>}
              <a onClick={logout} className="navbar-link-button">Salir</a>
            </>
          ) : (
            <NavLink to="/login">Cuenta</NavLink>
          )}
          {/* --- BOTÓN CARRITO RE-AÑADIDO --- */}
          <a onClick={openCart} className="navbar-link-button">Carrito</a> 
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
          {user ? (
            <>
              <span>¡Hola, {user.nombre}!</span>
              {user.rol === 'super-admin' && <NavLink to="/admin" onClick={closeMobileMenu}>Panel</NavLink>}
              <a onClick={() => { logout(); closeMobileMenu(); }} className="navbar-link-button">Salir</a>
            </>
          ) : (
            <NavLink to="/login" onClick={closeMobileMenu}>Cuenta</NavLink>
          )}
          {/* --- BOTÓN CARRITO RE-AÑADIDO (MÓVIL) --- */}
          <a onClick={() => { openCart(); closeMobileMenu(); }} className="navbar-link-button">Carrito</a> 
        </div>
      )}

      <div className="navbar-promo">
        <h1>¡Día nuevo, descuentos nuevos! 40% Desc 🌟</h1>
      </div>
    </nav>
  );
};