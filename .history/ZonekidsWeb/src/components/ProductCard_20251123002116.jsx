import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import '../styles/components/productCard.css';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const { 
    id, 
    nombre, 
    precio, 
    imagenesUrl,
    stock = 0,
    esNuevo = false,
    enOferta = false,
    precio_base 
  } = product;
  
  // Obtener primera imagen del array o usar logo por defecto
  const imagenPrincipal = Array.isArray(imagenesUrl) && imagenesUrl.length > 0 
    ? imagenesUrl[0] 
    : '/public/Zonekids_logo_web.webp';

  const tieneDescuento = precio_base && precio_base > precio;

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
  };

  return (
    <div className={cardClasses.trim()}>
      {stock <= 10 && <div className="low-stock-badge">¡Quedan pocos!</div>}
      <div className="product-badges">
        {esNuevo && <span className="badge-nuevo">NUEVO</span>}
        {enOferta && <span className="badge-oferta">OFERTA</span>}
      </div>

      <Link to={`/producto/${id || 'default'}`}> 
        <img src={imagenPrincipal} alt={nombre || 'Producto'} className="product-image" />
      </Link>

      <div className="product-info">
        <Link to={`/producto/${id || 'default'}`} className="product-name-link">
          <h3 className="product-name">{nombre || 'Nombre no disponible'}</h3>
        </Link>
        
        <div className="product-price-wrapper">
          {enOferta && precio_base > 0 && (
            <span className="product-price-original">
              ${(precio_base || 0).toLocaleString('es-CO')}
            </span>
          )}
          <span className="product-price">
            ${(precio || 0).toLocaleString('es-CO')}
          </span>
        </div>

        <button onClick={handleAddToCart} className="add-to-cart-button">
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
};