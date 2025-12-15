import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/checkoutPage.css';

export const CheckoutPage = () => {
  const { cartItems, removeFromCart, getTotalPrice, setCartItems, closeCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [quantities, setQuantities] = useState({});
  const [form, setForm] = useState({
    name: user?.nombre || '',
    email: user?.email || '',
    address: '',
    payment: 'tarjeta',
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [showVoucher, setShowVoucher] = useState(false);

  // Redirigir a login si no está loggeado
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user, navigate]);

  // Inicializar cantidades desde el carrito
  useEffect(() => {
    const initialQuantities = {};
    cartItems.forEach(item => {
      initialQuantities[item.id] = item.cantidad || 1;
    });
    setQuantities(initialQuantities);
    // Resetear cupón cuando cambia el carrito
    setCouponCode('');
    setCouponDiscount(0);
    setFreeShipping(false);
    setCouponError('');
  }, [cartItems]);

  // Cambiar cantidad de producto
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantities(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  // Calcular total con cantidades actuales
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const qty = quantities[item.id] || item.cantidad || 1;
      return total + (item.precio * qty);
    }, 0);
  };

  // Constantes de cálculo
  const IVA_RATE = 0.05; // 5% IVA
  const BASE_SHIPPING = 3000;
  const shippingCost = freeShipping ? 0 : BASE_SHIPPING;
  const subtotal = calculateTotal();
  const iva = subtotal * IVA_RATE;
  const subtotalWithIVA = subtotal + iva;
  const discountAmount = subtotalWithIVA * (couponDiscount / 100);
  const finalTotal = (subtotalWithIVA - discountAmount) + shippingCost;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validar código de descuento
  const applyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    
    if (code === 'PROFEVIVIAN') {
      setFreeShipping(true);
      setCouponDiscount(0);
      setCouponSuccess('✓ Envío gratis aplicado');
    } else if (code === 'SACO7') {
      setFreeShipping(false);
      setCouponDiscount(50);
      setCouponSuccess('✓ 50% de descuento aplicado');
    } else if (code === '') {
      setCouponSuccess('');
      setFreeShipping(false);
      setCouponDiscount(0);
    } else {
      setCouponError('❌ Código de descuento inválido');
      setFreeShipping(false);
      setCouponDiscount(0);
    }
  };

  // Validar cantidad disponible
  const checkStockAvailability = () => {
    for (let item of cartItems) {
      const qty = quantities[item.id] || item.cantidad || 1;
      if (item.cantidad && qty > item.cantidad) {
        return `⚠️ Stock insuficiente para ${item.nombre}. Disponibles: ${item.cantidad}`;
      }
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar stock disponible
    const stockError = checkStockAvailability();
    if (stockError) {
      alert(stockError);
      return;
    }
    
    // Crear datos de la orden
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString('es-CO'),
      time: new Date().toLocaleTimeString('es-CO'),
      customer: form.name,
      email: form.email,
      address: form.address,
      payment: form.payment,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.nombre,
        price: item.precio,
        quantity: quantities[item.id] || item.cantidad || 1,
        imagenesUrl: item.imagenesUrl,
      })),
      subtotal,
      iva,
      subtotalWithIVA,
      discountPercentage: couponDiscount,
      discountAmount,
      freeShipping,
      shipping: shippingCost,
      couponCode: couponCode.toUpperCase(),
      total: finalTotal,
    };

    setOrderData(order);
    setShowVoucher(true);

    // Guardar en historial de compras
    saveOrderToHistory(order);

    // Limpiar carrito
    setCartItems([]);
    closeCart();
  };

  const saveOrderToHistory = (order) => {
    try {
      // Guardar orden asociada al usuario actual
      const userKey = `purchaseHistory_${user.id}`;
      const history = JSON.parse(localStorage.getItem(userKey) || '[]');
      history.push(order);
      localStorage.setItem(userKey, JSON.stringify(history));
    } catch (err) {
      console.error('Error saving order to history:', err);
    }
  };

  const handlePrintVoucher = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const html = generateVoucherHTML();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const generateVoucherHTML = () => {
    if (!orderData) return '';
    
    const itemsHTML = orderData.items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toLocaleString('es-CO')}</td>
        <td>$${(item.price * item.quantity).toLocaleString('es-CO')}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Boleta - ${orderData.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 2px solid #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            color: #ff6b6b;
          }
          .order-id {
            font-size: 14px;
            color: #666;
            margin: 5px 0;
          }
          .customer-info {
            margin: 20px 0;
            padding: 10px;
            background-color: #f5f5f5;
          }
          .customer-info p {
            margin: 5px 0;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #ff9ec5;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 14px;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
          }
          .total-section {
            text-align: right;
            margin: 20px 0;
            padding-top: 10px;
            border-top: 2px solid #333;
          }
          .total-section p {
            margin: 5px 0;
            font-size: 14px;
          }
          .total-section .grand-total {
            font-size: 18px;
            font-weight: bold;
            color: #ff6b6b;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ZoneKids</h1>
          <div class="order-id">Boleta de Venta</div>
          <div class="order-id">${orderData.id}</div>
          <div class="order-id">${orderData.date} ${orderData.time}</div>
        </div>

        <div class="customer-info">
          <p><strong>Cliente:</strong> ${orderData.customer}</p>
          <p><strong>Email:</strong> ${orderData.email}</p>
          <p><strong>Dirección:</strong> ${orderData.address}</p>
          <p><strong>Método de pago:</strong> ${orderData.payment === 'tarjeta' ? 'Tarjeta de crédito/débito' : orderData.payment === 'transferencia' ? 'Transferencia bancaria' : 'Efectivo al recibir'}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="total-section">
          <p>Subtotal: $${orderData.subtotal.toLocaleString('es-CO')}</p>
          <p>IVA (19%): $${orderData.iva.toLocaleString('es-CO')}</p>
          <p>Subtotal + IVA: $${orderData.subtotalWithIVA.toLocaleString('es-CO')}</p>
          <p>Envío: $${orderData.shipping.toLocaleString('es-CO')}</p>
          <p class="grand-total">Total: $${orderData.total.toLocaleString('es-CO')}</p>
        </div>

        <div class="footer">
          <p>¡Gracias por tu compra! 🛍️</p>
          <p>ZoneKids - Tienda Online</p>
        </div>
      </body>
      </html>
    `;
  };

  if (showVoucher && orderData) {
    return (
      <div className="voucher-container">
        <div className="voucher-content">
          <h1>✅ ¡Compra Confirmada!</h1>
          <p>Número de orden: <strong>{orderData.id}</strong></p>
          <p>Se ha enviado una confirmación a: <strong>{orderData.email}</strong></p>
          
          <div className="voucher-actions">
            <button onClick={handlePrintVoucher} className="print-button">
              🖨️ Imprimir Boleta
            </button>
            <button onClick={() => navigate('/')} className="continue-button">
              Volver a Inicio
            </button>
          </div>

          <div className="voucher-preview">
            <h3>Resumen de tu compra:</h3>
            {orderData.items.map((item, idx) => (
              <div key={idx} className="voucher-item">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString('es-CO')}</span>
              </div>
            ))}
            <div className="voucher-subtotal">
              <span>Subtotal:</span>
              <span>${orderData.subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="voucher-iva">
              <span>IVA (19%):</span>
              <span>${orderData.iva.toLocaleString('es-CO')}</span>
            </div>
            <div className="voucher-shipping">
              <span>Envío:</span>
              <span>${orderData.shipping.toLocaleString('es-CO')}</span>
            </div>
            <div className="voucher-total">
              <span>Total:</span>
              <span>${orderData.total.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page-container">
        <div className="empty-cart">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos antes de ir al checkout</p>
          <button onClick={() => navigate('/')} className="back-button">
            Volver a comprar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container">
      <h2>Finalizar compra</h2>

      <div className="checkout-content">
        {/* 🧾 Resumen del carrito */}
        <div className="cart-summary">
          <h3>Tu carrito ({cartItems.length} productos)</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-checkout">
              <img src={item.imagenesUrl?.[0] || '/public/Zonekids_logo_web.webp'} alt={item.nombre} />
              <div className="item-details">
                <p className="item-name">{item.nombre}</p>
                <p className="item-price">${(item.precio || 0).toLocaleString('es-CO')}</p>
              </div>
              
              <div className="quantity-control">
                <button onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) - 1)}>−</button>
                <span>{quantities[item.id] || item.cantidad || 1}</span>
                <button onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) + 1)}>+</button>
              </div>

              <p className="item-total">
                ${((item.precio || 0) * (quantities[item.id] || item.cantidad || 1)).toLocaleString('es-CO')}
              </p>

              <button 
                onClick={() => removeFromCart(item.id)}
                className="delete-button"
                title="Eliminar producto"
              >
                🗑️
              </button>
            </div>
          ))}

          {/* Sección de cupón */}
          <div className="coupon-section">
            <h4>Aplicar cupón (opcional)</h4>
            <div className="coupon-input-group">
              <input
                type="text"
                placeholder="Ingresa tu código de cupón"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="coupon-input"
              />
              <button 
                type="button"
                onClick={applyCoupon}
                className="apply-coupon-btn"
              >
                Aplicar
              </button>
            </div>
            {couponError && <p className="coupon-error">{couponError}</p>}
            {couponDiscount > 0 && (
              <p className="coupon-success">✓ Cupón aplicado: {couponDiscount}% de descuento</p>
            )}
            {freeShipping && (
              <p className="coupon-success">✓ Envío gratis activado</p>
            )}
          </div>

          <div className="cart-total">
            <p>Subtotal: ${subtotal.toLocaleString('es-CO')}</p>
            <p>IVA (5%): ${iva.toLocaleString('es-CO')}</p>
            <p>Subtotal + IVA: ${subtotalWithIVA.toLocaleString('es-CO')}</p>
            
            {discountAmount > 0 && (
              <p className="discount-line">Descuento ({couponDiscount}%): -${discountAmount.toLocaleString('es-CO')}</p>
            )}
            
            <p>Envío: {freeShipping ? <span className="free-shipping">GRATIS</span> : `$${shippingCost.toLocaleString('es-CO')}`}</p>
            <h4>Total: ${finalTotal.toLocaleString('es-CO')}</h4>
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
              💳 Pagar ${finalTotal.toLocaleString('es-CO')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
