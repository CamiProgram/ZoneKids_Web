import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/components/CartModal.css';

export const CartModal = () => {
  const { cartItems, isCartOpen, closeCart, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  // Función para construir URLs completas
  const getImageUrl = (imagenUrl) => {
    if (!imagenUrl) {
      return '/assets/Zonekids_logo_web.webp';
    }
    // Si es URL absoluta, devolverla tal cual
    if (imagenUrl.startsWith('http')) {
      return imagenUrl;
    }
    // Si es ruta relativa, agregar base URL del backend
    return `http://localhost:8080${imagenUrl.startsWith('/') ? '' : '/'}${imagenUrl}`;
  };

  const handleGoToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  if (!isCartOpen) return null;

  return (
    <div className="cart-modal-overlay" onClick={closeCart}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* --- BOTÓN CERRAR --- */}
        <button className="cart-modal-close" onClick={closeCart}>
          ✕
        </button>

        {/* --- TÍTULO --- */}
        <h2 className="cart-modal-title">Tu Carrito</h2>

        {/* --- LISTA DE PRODUCTOS --- */}
        {cartItems.length > 0 ? (
          <div className="cart-items-list">
            {cartItems.map((item) => {
              const imageUrl = getImageUrl(
                Array.isArray(item.imagenesUrl)
                  ? item.imagenesUrl[0]
                  : item.imagenesUrl
              );
              
              return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={imageUrl}
                    alt={item.nombre}
                    onError={(e) => {
                      console.error('❌ Error cargando imagen en carrito:', imageUrl);
                      e.target.src = '/assets/Zonekids_logo_web.webp';
                    }}
                    onLoad={() => {
                      console.log('✅ Imagen del carrito cargada:', imageUrl);
                    }}
                  />
                </div>

                <div className="cart-item-details">
                  <h4 className="cart-item-name">{item.nombre}</h4>
                  <p className="cart-item-price">
                    ${item.precio.toLocaleString('es-CO')}
                  </p>
                  {item.cantidad && (
                    <p className="cart-item-quantity">
                      Cantidad: <strong>{item.cantidad}</strong>
                    </p>
                  )}
                </div>

                <button
                  className="cart-item-delete"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Eliminar del carrito"
                >
                  🗑️
                </button>
              </div>
              );
            })}
          </div>
        ) : (
          <p className="cart-empty">Tu carrito está vacío</p>
        )}

        {/* --- TOTAL Y BOTONES --- */}
        {cartItems.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-total">
              <strong>Total:</strong>
              <span className="total-price">
                ${getTotalPrice().toLocaleString('es-CO')}
              </span>
            </div>

            <div className="cart-modal-buttons">
              <button className="btn-continue-shopping" onClick={closeCart}>
                Continuar Comprando
              </button>
              <button className="btn-go-to-checkout" onClick={handleGoToCheckout}>
                Ir al Carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};