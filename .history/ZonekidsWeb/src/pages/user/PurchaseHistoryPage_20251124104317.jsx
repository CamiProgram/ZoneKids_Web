import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages/purchaseHistoryPage.css';

export const PurchaseHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🖼️ Función para construir URLs de imágenes
  const getImageUrl = (imagenUrl) => {
    if (!imagenUrl) return '/assets/Zonekids_logo_web.webp';
    if (imagenUrl.startsWith('http')) return imagenUrl;
    return `http://localhost:8080${imagenUrl.startsWith('/') ? '' : '/'}${imagenUrl}`;
  };

  useEffect(() => {
    // Si el usuario no está loggeado, redirigir a login
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Cargar historial específico del usuario actual
      const userKey = `purchaseHistory_${user.id}`;
      const history = JSON.parse(localStorage.getItem(userKey) || '[]');
      setOrders(history.reverse()); // Mostrar más recientes primero
    } catch (err) {
      console.error('Error loading purchase history:', err);
    }
  }, [user, navigate]);

  if (orders.length === 0) {
    return (
      <div className="purchase-history-container">
        <h1>Historial de Compras</h1>
        <div className="empty-history">
          <p>No tienes compras registradas</p>
          <button onClick={() => navigate('/')} className="back-button">
            Volver a comprar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-history-container">
      <h1>Historial de Compras</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>{order.id}</h3>
                <p className="order-date">{order.date} - {order.time}</p>
                <p className="order-customer">{order.customer}</p>
              </div>
              <div className="order-total">
                <p className="total-amount">${order.total.toLocaleString('es-CO')}</p>
                <button 
                  onClick={() => navigate(`/orden/${order.id}`, { state: { order } })}
                  className="view-button"
                >
                  Ver Detalle
                </button>
              </div>
            </div>
            <div className="order-preview">
              <p className="items-count">{order.items.length} producto(s)</p>
              <div className="items-preview">
                {order.items.slice(0, 3).map((item, idx) => (
                  <img 
                    key={idx}
                    src={getImageUrl(item.imagenesUrl?.[0])} 
                    alt={item.name}
                    className="item-thumbnail"
                    onError={(e) => {
                      e.target.src = '/assets/Zonekids_logo_web.webp';
                    }}
                  />
                ))}
                {order.items.length > 3 && (
                  <div className="more-items">+{order.items.length - 3}</div>
                )}
              </div>
              <p className="payment-method">
                Pago: {order.payment === 'tarjeta' ? 'Tarjeta' : order.payment === 'transferencia' ? 'Transferencia' : 'Efectivo'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
