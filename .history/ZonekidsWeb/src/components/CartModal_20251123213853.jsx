import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/components/CartModal.css';

export const CartModal = () => {
  const { cart, removeFromCart, updateQuantity, timeRemaining } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);

  const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  const getProductImage = (product) => {
    return product.imagenes && product.imagenes.length > 0 
      ? product.imagenes[0] 
      : '/assets/Zonekids_logo_web.webp';
  };

  // Verificar si el producto tiene stock disponible
  const isOutOfStock = (product) => {
    return product.stock <= 0;
  };

  const formatTimeRemaining = () => {
    if (!timeRemaining) return '';
    const { hours, minutes, seconds } = timeRemaining;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <>
      <div className="cart-button-wrapper">
        <button 
          className="cart-button" 
          onClick={() => setIsOpen(!isOpen)}
          title="Carrito de compras"
        >
          🛒 Carrito ({itemCount})
        </button>
        {timeRemaining && cart.length > 0 && (
          <div className="cart-timer">
            ⏱️ {formatTimeRemaining()}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="cart-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <h2>Tu Carrito</h2>
              <button 
                className="close-button" 
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {cart.length > 0 ? (
              <>
                {timeRemaining && (
                  <div className="cart-expiry-warning">
                    ⏳ Tu carrito expirará en: <strong>{formatTimeRemaining()}</strong>
                  </div>
                )}
                
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className={`cart-item ${isOutOfStock(item) ? 'out-of-stock' : ''}`}>
                      <img src={getProductImage(item)} alt={item.nombre} className={`cart-item-image ${isOutOfStock(item) ? 'grayscale' : ''}`} />
                      <div className="cart-item-info">
                        <h4>{item.nombre}</h4>
                        <p>${item.precio.toLocaleString()}</p>
                        {isOutOfStock(item) && <span className="stock-badge">Agotado</span>}
                      </div>
                      <div className="cart-item-controls">
                        <button onClick={() => updateQuantity(item.id, item.cantidad - 1)} disabled={isOutOfStock(item)}>-</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => updateQuantity(item.id, item.cantidad + 1)} disabled={isOutOfStock(item)}>+</button>
                      </div>
                      <div className="cart-item-total">
                        ${(item.precio * item.cantidad).toLocaleString()}
                      </div>
                      <button 
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <button className="checkout-button">Ir a Pagar</button>
              </>
            ) : (
              <div className="empty-cart">
                <p>Tu carrito está vacío</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};