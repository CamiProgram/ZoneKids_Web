import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import '../styles/components/productCard.css';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  const { 
    id, 
    nombre, 
    precio, 
    imagenesUrl,
    stock = 0,
    esNuevo = false,
    enOferta = false,
    precioOriginal 
  } = product;
  
  // Obtener primera imagen del array o usar logo por defecto
  const getImageUrl = () => {
    if (!Array.isArray(imagenesUrl) || imagenesUrl.length === 0) {
      return '/public/Zonekids_logo_web.webp';
    }
    const firstImage = imagenesUrl[0];
    // Si es URL absoluta, devolverla tal cual
    if (firstImage.startsWith('http')) {
      return firstImage;
    }
    // Si es ruta relativa, agregar base URL del backend
    return `http://localhost:8080${firstImage.startsWith('/') ? '' : '/'}${firstImage}`;
  };

  const imagenPrincipal = getImageUrl();

  const tieneDescuento = precioOriginal && precioOriginal > precio;

  const cardClasses = `
    product-card 
    ${enOferta ? 'product-card--oferta' : ''}
    ${stock <= 10 ? 'product-card--low-stock' : ''}
  `;

  const handleAddToCart = () => {
    addToCart({
      ...product,
      imagenesUrl: Array.isArray(imagenesUrl) ? imagenesUrl : [imagenesUrl]
    });
    
    // Mostrar feedback visual
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className={cardClasses.trim()}>
      {stock <= 10 && <div className="low-stock-badge">¡Quedan pocos!</div>}
      <div className="product-badges">
        {esNuevo && <span className="badge-nuevo">NUEVO</span>}
        {enOferta && <span className="badge-oferta">OFERTA</span>}
      </div>

      <Link to={`/producto/${id || 'default'}`}> 
        <img 
          src={imagenPrincipal} 
          alt={nombre || 'Producto'} 
          className="product-image"
          onError={(e) => {
            console.error('❌ Error loading product image:', imagenPrincipal);
            e.target.src = '/public/Zonekids_logo_web.webp';
          }}
        />
      </Link>

      <div className="product-info">
        <Link to={`/producto/${id || 'default'}`} className="product-name-link">
          <h3 className="product-name">{nombre || 'Nombre no disponible'}</h3>
        </Link>
        
        <div className="product-price-wrapper">
          {enOferta && precioOriginal && precioOriginal > 0 && (
            <span className="product-price-original">
              ${(precioOriginal || 0).toLocaleString('es-CO')}
            </span>
          )}
          <span className="product-price">
            ${(precio || 0).toLocaleString('es-CO')}
          </span>
        </div>

        <button onClick={handleAddToCart} className={`add-to-cart-button ${isAdded ? 'added' : ''}`}>
          {isAdded ? '✓ Añadido' : 'Añadir al Carrito'}
        </button>
      </div>
    </div>
  );
};