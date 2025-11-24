import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import '../../styles/pages/checkoutPage.css';

export const CheckoutPage = () => {
  const { cartItems, removeFromCart, getTotalPrice, setCartItems, closeCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [quantities, setQuantities] = useState({});
  const [form, setForm] = useState({
    name: user?.nombre || '',
    email: user?.email || '',
    rut: '',
    address: '',
    rut: '',
    payment: 'tarjeta',
  });
  const [formErrors, setFormErrors] = useState({});
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
    setCouponSuccess('');
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
    const { name, value } = e.target;
    let processedValue = value;
    let error = '';

    // Validaciones en tiempo real
    if (name === 'name') {
      // Solo letras, espacios y acentos
      processedValue = value.replace(/[^a-záéíóúàèìòùñA-ZÁÉÍÓÚÀÈÌÒÙÑ\s]/g, '');
      if (processedValue.length === 0 && value.length > 0) {
        error = 'El nombre solo puede contener letras';
      } else if (processedValue.length < 3) {
        error = 'El nombre debe tener al menos 3 caracteres';
      }
    } else if (name === 'email') {
      // Validar formato de email
      const emailRegex = /^[^\s@]*@?[^\s@]*\.?[^\s@]*$/;
      if (!emailRegex.test(value)) {
        error = 'Formato de email inválido';
      } else if (value.includes('@') && value.includes('.')) {
        error = '';
      } else if (value.length > 0 && (!value.includes('@') || !value.includes('.'))) {
        error = 'Email incompleto (debe contener @ y .)';
      }
    } else if (name === 'rut') {
      // Solo números y letra K, formato: 12345678-9 o 21867867-K
      processedValue = value.replace(/[^0-9kK]/g, '');
      
      // Auto-formatear con guión antes del último carácter
      if (processedValue.length > 1) {
        // Si tiene más de 1 carácter, insertar guión antes del último
        const mainPart = processedValue.slice(0, -1);
        const verifierPart = processedValue.slice(-1).toUpperCase();
        processedValue = `${mainPart}-${verifierPart}`;
      }
      
      // Limitar a longitud máxima (8 dígitos + guión + 1 verificador = 10 caracteres)
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10);
      }
      
      // Validar formato RUT
      if (processedValue.length > 0) {
        if (processedValue.replace('-', '').length < 8) {
          error = 'El RUT debe tener al menos 8 dígitos';
        }
      }
    } else if (name === 'address') {
      // Validar que no esté vacío
      if (value.length === 0) {
        error = '';
      } else if (value.length < 5) {
        error = 'La dirección debe tener al menos 5 caracteres';
      }
    }

    setForm(prev => ({
      ...prev,
      [name]: processedValue
    }));

    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que todos los campos sean válidos
    const errors = {};
    
    if (!form.name || form.name.length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!form.email || !form.email.includes('@') || !form.email.includes('.')) {
      errors.email = 'Email inválido';
    }
    
    if (!form.rut) {
      errors.rut = 'El RUT es requerido';
    } else if (form.rut.length < 8) {
      errors.rut = 'El RUT debe tener al menos 8 dígitos';
    }
    
    if (!form.address || form.address.length < 5) {
      errors.address = 'La dirección debe tener al menos 5 caracteres';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert('Por favor completa todos los campos correctamente');
      return;
    }
    
    // Verificar stock disponible
    const stockError = checkStockAvailability();
    if (stockError) {
      alert(stockError);
      return;
    }
    
    try {
      // Crear orden en el backend (descuenta stock automáticamente)
      const orderResponse = await createOrderInBackend();
      
      // Si la orden fue exitosa, procesar
      if (orderResponse) {
        // Crear datos de la orden para mostrar
        const order = {
          id: orderResponse.id || `ORD-${Date.now()}`,
          date: new Date().toLocaleDateString('es-CO'),
          time: new Date().toLocaleTimeString('es-CO'),
          customer: form.name,
          email: form.email,
          rut: form.rut,
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
      }
    } catch (err) {
      console.error('Error al procesar la compra:', err);
      alert(err.message || 'Error al procesar la compra. Intenta nuevamente.');
    }
  };

  const createOrderInBackend = async () => {
    try {
      // Preparar detalles de la orden para el backend
      const detalles = cartItems.map(item => ({
        productoId: item.id,
        cantidad: quantities[item.id] || item.cantidad || 1
      }));

      // Enviar orden al backend
      const response = await productService.createOrder({
        usuarioId: user.id,
        detalles
      });

      if (response && response.id) {
        return response;
      }
      throw new Error('Error al crear la orden en el backend');
    } catch (err) {
      console.error('Error creating order in backend:', err);
      throw new Error(err.response?.data?.message || 'No se pudo crear la orden');
    }
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
          <p><strong>RUT:</strong> ${orderData.rut}</p>
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
            {couponSuccess && <p className="coupon-success">{couponSuccess}</p>}
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
            <label>Nombre completo *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Juan Pérez García"
            />
            {formErrors.name && <p className="form-error-message">{formErrors.name}</p>}

            <label>Correo electrónico *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="correo@ejemplo.com"
            />
            {formErrors.email && <p className="form-error-message">{formErrors.email}</p>}

            <label>RUT * (formato: 12345678-9)</label>
            <input
              type="text"
              name="rut"
              value={form.rut}
              onChange={handleChange}
              required
              placeholder="Ej: 12345678-9"
            />
            {formErrors.rut && <p className="form-error-message">{formErrors.rut}</p>}

            <label>Dirección *</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Calle Principal 123, Dpto 4B"
            />
            {formErrors.address && <p className="form-error-message">{formErrors.address}</p>}

            <label>Método de pago *</label>
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
