import React, { useState, useEffect } from 'react';
import '../../styles/pages/checkoutPage.css';

export const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    payment: 'tarjeta',
  });

  useEffect(() => {
    // Simulación de productos del carrito (sin backend todavía)
    const mockCart = [
      { id: 1, name: 'Zapatillas Nike Air', price: 49990, quantity: 1, image: '/assets/product-placeholder.jpg' },
      { id: 2, name: 'Polera Oversize', price: 19990, quantity: 2, image: '/assets/product-placeholder.jpg' },
    ];
    setCartItems(mockCart);
  }, []);

  useEffect(() => {
    const totalCalc = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalCalc);
  }, [cartItems]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Gracias por tu compra, ${form.name}! 🛍️`);
  };

  return (
    <div className="checkout-page-container">
      <h2>Finalizar compra</h2>

      <div className="checkout-content">
        {/* 🧾 Resumen del carrito */}
        <div className="cart-summary">
          <h3>Tu carrito</h3>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p>${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No tienes productos en el carrito.</p>
          )}

          <div className="cart-total">
            <p>Subtotal: ${total.toLocaleString()}</p>
            <p>Envío: $4.000</p>
            <h4>Total: ${(total + 4000).toLocaleString()}</h4>
          </div>
        </div>

        {/* Formulario de datos */}
        <div className="checkout-form-container">
          <h3>Datos del comprador</h3>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>Nombre completo</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Dirección</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />

            <label>Método de pago</label>
            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
            >
              <option value="tarjeta">Tarjeta de crédito / débito</option>
              <option value="transferencia">Transferencia bancaria</option>
              <option value="efectivo">Efectivo al recibir</option>
            </select>

            <button type="submit" className="checkout-button">
              Confirmar compra
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
