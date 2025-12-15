import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { productService } from '../../services/productService';
import { userService } from '../../services/userService';
import '../../styles/pages/adminDashboard.css';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    lowStockProducts: 0,
    activeProducts: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [products, users] = await Promise.all([
          productService.getAll(),
          userService.getAll(),
        ]);

        const lowStockCount = products.filter(p => p.stock < 10).length;
        const activeCount = products.filter(p => p.estado === 'activo').length;

        setStats({
          totalProducts: products.length,
          totalUsers: users.length,
          lowStockProducts: lowStockCount,
          activeProducts: activeCount,
        });

        // Mock orders for now - in production get from API
        const mockOrders = [
          {
            id: 1,
            clienteName: 'Juan Pérez',
            clienteEmail: 'juan@example.com',
            monto: 125990,
            fecha: '2025-11-23',
            estado: 'entregado',
            items: 3
          },
          {
            id: 2,
            clienteName: 'María García',
            clienteEmail: 'maria@example.com',
            monto: 89990,
            fecha: '2025-11-22',
            estado: 'pendiente',
            items: 2
          },
          {
            id: 3,
            clienteName: 'Carlos López',
            clienteEmail: 'carlos@example.com',
            monto: 249990,
            fecha: '2025-11-21',
            estado: 'en-envío',
            items: 5
          }
        ];
        setOrders(mockOrders);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar las estadísticas del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'entregado':
        return '#28a745';
      case 'en-envío':
        return '#007bff';
      case 'pendiente':
        return '#ffc107';
      case 'cancelado':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'entregado':
        return '✓ Entregado';
      case 'en-envío':
        return '📦 En envío';
      case 'pendiente':
        return '⏳ Pendiente';
      case 'cancelado':
        return '✕ Cancelado';
      default:
        return status;
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, estado: newStatus } : order
    ));
    setSelectedOrder(prev => prev ? { ...prev, estado: newStatus } : null);
    setEditingStatus(null);
  };

  const downloadReceipt = (order) => {
    const receiptContent = `
╔════════════════════════════════════════╗
║          BOLETA DE COMPRA              ║
║          ZoneKids Store                ║
╚════════════════════════════════════════╝

Número de Orden: #${order.id}
Fecha: ${new Date(order.fecha).toLocaleDateString('es-CL')}

────────────────────────────────────────
DATA DEL CLIENTE
────────────────────────────────────────
Nombre: ${order.clienteName}
Email: ${order.clienteEmail}

────────────────────────────────────────
DETALLES DE LA COMPRA
────────────────────────────────────────
Cantidad de Artículos: ${order.items}
Monto Total: $${order.monto.toLocaleString()}

────────────────────────────────────────
ESTADO DEL PEDIDO
────────────────────────────────────────
${getStatusLabel(order.estado)}

────────────────────────────────────────
Gracias por tu compra en ZoneKids
────────────────────────────────────────
    `;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptContent));
    element.setAttribute('download', `boleta_${order.id}_${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="admin-dashboard-container">
      <h2>Dashboard Administrativo</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Productos</h3>
          <p>{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Productos Activos</h3>
          <p>{stats.activeProducts}</p>
        </div>
        <div className="stat-card low-stock">
          <h3>Stock Bajo (&lt;10)</h3>
          <p>{stats.lowStockProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Usuarios</h3>
          <p>{stats.totalUsers}</p>
        </div>
      </div>

      {/* --- SECCIÓN DE COMPRAS REALIZADAS --- */}
      <div className="orders-section">
        <h3>Compras Realizadas</h3>
        <div className="orders-table-wrapper">
          {orders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Cliente</th>
                  <th>Email</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td data-label="ID Orden">#{order.id}</td>
                    <td data-label="Cliente">{order.clienteName}</td>
                    <td data-label="Email">{order.clienteEmail}</td>
                    <td data-label="Monto" className="monto">${order.monto.toLocaleString()}</td>
                    <td data-label="Fecha">{new Date(order.fecha).toLocaleDateString('es-CL')}</td>
                    <td data-label="Estado">
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(order.estado) }}>
                        {getStatusLabel(order.estado)}
                      </span>
                    </td>
                    <td data-label="Acciones">
                      <button 
                        className="btn-view-order"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-orders">No hay compras registradas</p>
          )}
        </div>
      </div>

      {/* --- MODAL DE DETALLES DE ORDEN --- */}
      {selectedOrder && (
        <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedOrder(null)}>✕</button>
            
            <h3>Detalles de la Orden #{selectedOrder.id}</h3>
            
            <div className="order-details">
              <div className="detail-section">
                <h4>Información del Cliente</h4>
                <p><strong>Nombre:</strong> {selectedOrder.clienteName}</p>
                <p><strong>Email:</strong> {selectedOrder.clienteEmail}</p>
              </div>

              <div className="detail-section">
                <h4>Información de la Orden</h4>
                <p><strong>Número de Orden:</strong> #{selectedOrder.id}</p>
                <p><strong>Fecha:</strong> {new Date(selectedOrder.fecha).toLocaleDateString('es-CL')}</p>
                <p><strong>Total:</strong> ${selectedOrder.monto.toLocaleString()}</p>
                <p><strong>Cantidad de Items:</strong> {selectedOrder.items}</p>
                <p><strong>Estado:</strong> <span style={{ color: getStatusColor(selectedOrder.estado), fontWeight: 'bold' }}>{getStatusLabel(selectedOrder.estado)}</span></p>
              </div>

              <div className="modal-actions">
                <button className="btn-export">📥 Descargar Recibo</button>
                <button className="btn-email">✉️ Enviar Correo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};