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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
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
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Error al cargar las estadísticas del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
    </div>
  );
};