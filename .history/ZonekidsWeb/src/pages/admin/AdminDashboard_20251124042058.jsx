import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AuthDiagnostic } from '../../components/AuthDiagnostic';
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

  // Función para calcular el estado automático basado en la fecha de creación
  const getAutoStatus = (order) => {
    const createdAt = new Date(order.fecha).getTime();
    const now = new Date().getTime();
    const minutesElapsed = (now - createdAt) / (1000 * 60);

    if (minutesElapsed < 1) {
      return 'pendiente';
    } else if (minutesElapsed < 6) {
      return 'confirmando';
    } else {
      return 'enviado';
    }
  };

  // Función para obtener el color según estado automático
  const getAutoStatusColor = (order) => {
    const status = getAutoStatus(order);
    switch (status) {
      case 'enviado':
        return '#28a745';
      case 'confirmando':
        return '#ffc107';
      case 'pendiente':
        return '#0d6efd';
      default:
        return '#6c757d';
    }
  };

  // Función para obtener el label según estado automático
  const getAutoStatusLabel = (order) => {
    const status = getAutoStatus(order);
    switch (status) {
      case 'enviado':
        return '📦 Enviado';
      case 'confirmando':
        return '⚙️ Confirmando...';
      case 'pendiente':
        return '⏳ Pendiente';
      default:
        return status;
    }
  };

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
        const ordersWithUserData = allOrders.map(order => {
          // Intenta obtener nombre y email del usuario de varias fuentes posibles
          let clienteName = 'Usuario Desconocido';
          let clienteEmail = 'sin-email@example.com';

          // Intentar obtener de order.usuario (objeto anidado)
          if (order.usuario) {
            if (typeof order.usuario === 'object') {
              clienteName = order.usuario.nombre || order.usuario.name || clienteName;
              clienteEmail = order.usuario.email || clienteEmail;
            } else if (typeof order.usuario === 'string') {
              // Si es un string, podría ser un ID, intentar buscar en users
              const foundUser = users.find(u => u.id === order.usuario || u.id.toString() === order.usuario);
              if (foundUser) {
                clienteName = foundUser.nombre || foundUser.name || clienteName;
                clienteEmail = foundUser.email || clienteEmail;
              }
            }
          }

          // Alternativas si usuario no existe
          if (clienteName === 'Usuario Desconocido') {
            if (order.usuarioNombre) clienteName = order.usuarioNombre;
            if (order.clienteName) clienteName = order.clienteName;
            if (order.nombre) clienteName = order.nombre;
          }

          if (clienteEmail === 'sin-email@example.com') {
            if (order.usuarioEmail) clienteEmail = order.usuarioEmail;
            if (order.clienteEmail) clienteEmail = order.clienteEmail;
            if (order.email) clienteEmail = order.email;
          }

          return {
            id: order.id,
            clienteName,
            clienteEmail,
            monto: order.total || 0,
            fecha: order.fecha || new Date().toISOString(),
            estado: order.estado || 'pendiente',
            items: order.detalles?.length || 0,
            detalles: order.detalles || []
          };
        });

        setOrders(ordersWithUserData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        // Mostrar mensajes de error específicos
        if (err.response?.status === 403) {
          setError('No tienes permisos para acceder al dashboard. Verifica tu rol.');
        } else if (err.response?.status === 401) {
          setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else {
          setError('Error al cargar las compras realizadas. Intenta más tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Actualizar la vista cada minuto para reflejar cambios automáticos de estado
  useEffect(() => {
    const interval = setInterval(() => {
      // Forzar re-render para actualizar estados automáticos
      setOrders(prev => [...prev]);
      if (selectedOrder) {
        setSelectedOrder(prev => prev ? { ...prev } : null);
      }
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, [selectedOrder]);

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

  const handleStatusChange = async (orderId, newStatus) => {
    // Guardar el estado anterior por si falla
    const previousOrder = orders.find(o => o.id === orderId);
    const previousStatus = previousOrder.estado;
    
    try {
      setSavingStatus(orderId);
      
      // Si el estado automático ya llegó a "enviado", no hacer cambios
      const autoStatus = getAutoStatus(previousOrder);
      if (autoStatus === 'enviado' && newStatus === 'enviado') {
        console.log('La orden ya está en estado enviado automáticamente');
        setSavingStatus(null);
        return;
      }
      
      // Actualizar inmediatamente en el frontend (optimistic update)
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, estado: newStatus } : order
      );
      setOrders(updatedOrders);
      setSelectedOrder(prev => prev ? { ...prev, estado: newStatus } : null);
      setEditingStatus(null);
      
      // Esperar a que se guarde en el backend
      const response = await orderService.updateStatus(orderId, newStatus);
      
      // Verificar que el backend confirmó el cambio
      if (response && (response.estado === newStatus || response.data?.estado === newStatus)) {
        console.log('Estado de orden actualizado exitosamente en el backend');
      } else {
        // Si el backend no confirmó, revertir el cambio
        console.warn('El backend no confirmó el cambio de estado');
        const revertedOrders = orders.map(order => 
          order.id === orderId ? { ...order, estado: previousStatus } : order
        );
        setOrders(revertedOrders);
        setSelectedOrder(prev => prev ? { ...prev, estado: previousStatus } : null);
      }
    } catch (err) {
      console.error('Error al actualizar el estado:', err);
      
      // Revertir al estado anterior si hay error
      const revertedOrders = orders.map(order => 
        order.id === orderId ? { ...order, estado: previousStatus } : order
      );
      setOrders(revertedOrders);
      setSelectedOrder(prev => prev ? { ...prev, estado: previousStatus } : null);
      setError('Error al cambiar el estado. Intenta nuevamente.');
    } finally {
      setSavingStatus(null);
    }
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
                        style={{ backgroundColor: getAutoStatusColor(order), cursor: 'pointer' }}
                        onClick={() => setSelectedOrder(order)}
                        title="Click para ver detalles"
                      >
                        {getAutoStatusLabel(order)}
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
                  <span style={{ color: getAutoStatusColor(selectedOrder), fontWeight: 'bold', marginLeft: '10px' }}>
                    {getAutoStatusLabel(selectedOrder)}
                  </span>
                  <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                    (Automático - cambios cada minuto)
                  </span>
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