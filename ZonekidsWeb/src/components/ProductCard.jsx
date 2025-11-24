import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import '../styles/components/productCard.css';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // Nuevos campos del backend
  const { id, nombre, precio, imagenes, stock, esNuevo, enOferta, precioOriginal } = product;
  const tieneDescuento = precioOriginal && precioOriginal > precio;
  const imagenPrincipal = imagenes && imagenes.length > 0 ? imagenes[0] : "/assets/Zonekids_logo_web.webp";

  const cardClasses = `
    product-card 
    ${enOferta ? 'product-card--oferta' : ''}
    ${stock <= 10 ? 'product-card--low-stock' : ''}
  `;

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
          {enOferta && precioOriginal && precioOriginal > 0 && (
            <span className="product-price-original">
              ${(precioOriginal || 0).toLocaleString()}
            </span>
          )}
          <span className="product-price">${(precio || 0).toLocaleString()}</span>
        </div>

        <button onClick={() => addToCart(product)} className="add-to-cart-button">
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
};