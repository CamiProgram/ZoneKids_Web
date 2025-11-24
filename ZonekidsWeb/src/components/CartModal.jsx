import React from 'react';
import { useCart } from '../context/CartContext';
<<<<<<< HEAD
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
=======
import { useNavigate } from 'react-router-dom';
import '../styles/components/CartModal.css';

export const CartModal = () => {
  const { cartItems, isCartOpen, closeCart, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

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
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={
                      Array.isArray(item.imagenesUrl)
                        ? item.imagenesUrl[0]
                        : item.imagenesUrl
                    }
                    alt={item.nombre}
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
            ))}
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
>>>>>>> d99599658d0ef567e8cb530231754aeb6b09437d
  );
};