import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/pages/orderDetailPage.css';

export const OrderDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // 🖼️ Función para construir URLs de imágenes
  const getImageUrl = (imagenUrl) => {
    if (!imagenUrl) return '/assets/Zonekids_logo_web.webp';
    if (imagenUrl.startsWith('http')) return imagenUrl;
    return `http://localhost:8080${imagenUrl.startsWith('/') ? '' : '/'}${imagenUrl}`;
  };

  if (!order) {
    return (
      <div className="order-detail-container">
        <div className="error-message">
          <p>Orden no encontrada</p>
          <button onClick={() => navigate('/historial')} className="back-button">
            Volver al historial
          </button>
        </div>
      </div>
    );
  }

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
    const itemsHTML = order.items.map(item => `
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
        <title>Boleta - ${order.id}</title>
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
          <div class="order-id">${order.id}</div>
          <div class="order-id">${order.date} ${order.time}</div>
        </div>

        <div class="customer-info">
          <p><strong>Cliente:</strong> ${order.customer}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Dirección:</strong> ${order.address}</p>
          <p><strong>Método de pago:</strong> ${order.payment === 'tarjeta' ? 'Tarjeta de crédito/débito' : order.payment === 'transferencia' ? 'Transferencia bancaria' : 'Efectivo al recibir'}</p>
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
          <p>Subtotal: $${order.subtotal.toLocaleString('es-CO')}</p>
          <p>Envío: $${order.shipping.toLocaleString('es-CO')}</p>
          <p class="grand-total">Total: $${order.total.toLocaleString('es-CO')}</p>
        </div>

        <div class="footer">
          <p>¡Gracias por tu compra! 🛍️</p>
          <p>ZoneKids - Tienda Online</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="order-detail-container">
      <button onClick={() => navigate('/historial')} className="back-link">
        ← Volver al historial
      </button>

      <div className="order-detail-content">
        {/* Encabezado de orden */}
        <div className="order-header-detail">
          <div>
            <h1>{order.id}</h1>
            <p className="order-date-detail">{order.date} {order.time}</p>
          </div>
          <div className="order-status">
            <p className="status-badge">✓ Completada</p>
          </div>
        </div>

        {/* Información del cliente */}
        <div className="customer-section">
          <h2>Información del Cliente</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Nombre</label>
              <p>{order.customer}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{order.email}</p>
            </div>
            <div className="info-item">
              <label>Dirección</label>
              <p>{order.address}</p>
            </div>
            <div className="info-item">
              <label>Método de Pago</label>
              <p>
                {order.payment === 'tarjeta' ? 'Tarjeta de crédito/débito' :
                 order.payment === 'transferencia' ? 'Transferencia bancaria' :
                 'Efectivo al recibir'}
              </p>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="products-section">
          <h2>Productos Comprados</h2>
          <div className="products-table">
            <div className="table-header">
              <div className="col-product">Producto</div>
              <div className="col-qty">Cantidad</div>
              <div className="col-price">Precio</div>
              <div className="col-total">Total</div>
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="table-row">
                <div className="col-product">
                  {item.imagenesUrl && item.imagenesUrl.length > 0 && (
                    <img 
                      src={getImageUrl(item.imagenesUrl[0])} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = '/assets/Zonekids_logo_web.webp';
                      }}
                    />
                  )}
                  <span>{item.name}</span>
                </div>
                <div className="col-qty">{item.quantity}</div>
                <div className="col-price">${item.price.toLocaleString('es-CO')}</div>
                <div className="col-total">${(item.price * item.quantity).toLocaleString('es-CO')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de pago */}
        <div className="payment-summary">
          <div className="summary-item">
            <span>Subtotal</span>
            <span>${order.subtotal.toLocaleString('es-CO')}</span>
          </div>
          <div className="summary-item">
            <span>Envío</span>
            <span>${order.shipping.toLocaleString('es-CO')}</span>
          </div>
          <div className="summary-item total">
            <span>Total</span>
            <span>${order.total.toLocaleString('es-CO')}</span>
          </div>
        </div>

        {/* Botón descargar boleta */}
        <div className="actions">
          <button onClick={handlePrintVoucher} className="print-voucher-button">
            🖨️ Descargar Boleta
          </button>
        </div>
      </div>
    </div>
  );
};
