import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/components/CartModal.css';

export const CartModal = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);

  const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  const getProductImage = (product) => {
    return product.imagenes && product.imagenes.length > 0 
      ? product.imagenes[0] 
      : '/assets/Zonekids_logo_web.webp';
  };

  return (
    <>
      <button 
        className="cart-button" 
        onClick={() => setIsOpen(!isOpen)}
        title="Carrito de compras"
      >
        🛒 Carrito ({itemCount})
      </button>

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
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={getProductImage(item)} alt={item.nombre} className="cart-item-image" />
                      <div className="cart-item-info">
                        <h4>{item.nombre}</h4>
                        <p>${item.precio.toLocaleString()}</p>
                      </div>
                      <div className="cart-item-controls">
                        <button onClick={() => updateQuantity(item.id, item.cantidad - 1)}>-</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => updateQuantity(item.id, item.cantidad + 1)}>+</button>
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