import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { productService } from '../../services/productService';
import { userService } from '../../services/userService';
import { orderService } from '../../services/orderService';
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
  const [savingStatus, setSavingStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [products, users, allOrders] = await Promise.all([
          productService.getAll(),
          userService.getAll(),
          orderService.getAll(),
        ]);

        const lowStockCount = products.filter(p => p.stock < 10).length;
        const activeCount = products.filter(p => p.estado === 'activo').length;

        setStats({
          totalProducts: products.length,
          totalUsers: users.length,
          lowStockProducts: lowStockCount,
          activeProducts: activeCount,
        });

        // Mapear órdenes con información del usuario
        const ordersWithUserData = allOrders.map(order => ({
          id: order.id,
          clienteName: order.usuario?.nombre || 'Usuario Desconocido',
          clienteEmail: order.usuario?.email || 'sin-email@example.com',
          monto: order.total || 0,
          fecha: order.fecha || new Date().toISOString(),
          estado: order.estado || 'pendiente',
          items: order.detalles?.length || 0,
          detalles: order.detalles || []
        }));

        setOrders(ordersWithUserData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar las compras realizadas. Intenta más tarde.');
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
    // Actualizar inmediatamente en el frontend (optimistic update)
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, estado: newStatus } : order
    );
    setOrders(updatedOrders);
    setSelectedOrder(prev => prev ? { ...prev, estado: newStatus } : null);
    setEditingStatus(null);
    
    // Intentar actualizar en el backend (pero sin bloquear si falla)
    orderService.updateStatus(orderId, newStatus)
      .then(() => {
        console.log('Estado de orden actualizado en el backend');
      })
      .catch(err => {
        console.warn('No se pudo actualizar en el backend, pero el cambio se guardó localmente:', err);
        // El estado ya está actualizado en el frontend, así que continuamos
      });
  };

  const downloadReceipt = (order) => {
    // Construir los detalles de los items
    let detallesItems = '';
    if (order.detalles && order.detalles.length > 0) {
      detallesItems = `
ITEMS COMPRADOS:
`;
      order.detalles.forEach((item, index) => {
        const nombre = item.producto?.nombre || item.nombre || 'Producto';
        const precio = item.precio || item.producto?.precio || 0;
        const cantidad = item.cantidad || 1;
        const subtotal = precio * cantidad;
        detallesItems += `${index + 1}. ${nombre}
   Precio: $${precio.toLocaleString()}
   Cantidad: ${cantidad}
   Subtotal: $${subtotal.toLocaleString()}

`;
      });
    }

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
${detallesItems}
────────────────────────────────────────
RESUMEN DE PAGO
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

    // Abrir ventana de impresión
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Boleta de Compra #${order.id}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              background-color: #ffffff;
              color: #000;
              margin: 0;
            }
            .receipt {
              max-width: 600px;
              margin: 0 auto;
              white-space: pre-wrap;
              word-wrap: break-word;
              line-height: 1.6;
              border: 1px solid #ddd;
              padding: 20px;
              background-color: white;
            }
            .button-container {
              text-align: center;
              margin-top: 20px;
              display: print {
                display: none;
              }
            }
            button {
              padding: 10px 20px;
              margin: 0 5px;
              font-size: 14px;
              cursor: pointer;
              border: none;
              border-radius: 4px;
              background-color: #0d6efd;
              color: white;
            }
            button:hover {
              background-color: #0b5ed7;
            }
            @media print {
              body { padding: 0; background-color: white; }
              .button-container { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">${receiptContent}</div>
          <div class="button-container">
            <button onclick="window.print()">Imprimir</button>
            <button onclick="window.close()">Cerrar</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    
    // Esperar a que cargue y abrir diálogo de impresión
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
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
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(order.estado), cursor: 'pointer' }}
                        onClick={() => setSelectedOrder(order)}
                        title="Click para cambiar estado"
                      >
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
                <p>
                  <strong>Estado:</strong>
                  {editingStatus === selectedOrder.id ? (
                    <select 
                      value={selectedOrder.estado}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                      className="status-select"
                      style={{ marginLeft: '10px', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="pendiente">⏳ Pendiente</option>
                      <option value="en-envío">📦 En envío</option>
                      <option value="entregado">✓ Entregado</option>
                      <option value="cancelado">✕ Cancelado</option>
                    </select>
                  ) : (
                    <>
                      <span style={{ color: getStatusColor(selectedOrder.estado), fontWeight: 'bold', marginRight: '10px' }}>
                        {getStatusLabel(selectedOrder.estado)}
                      </span>
                      <button 
                        className="btn-edit-status"
                        onClick={() => setEditingStatus(selectedOrder.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#0d6efd',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ✎ Editar
                      </button>
                    </>
                  )}
                </p>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-export"
                  onClick={() => downloadReceipt(selectedOrder)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  📥 Descargar Boleta PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};