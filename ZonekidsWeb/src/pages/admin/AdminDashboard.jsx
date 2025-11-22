import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '../../components/LoadingSpinner'; // <-- Importar
import '../../styles/pages/adminDashboard.css';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalUsers: 0, lowStockProducts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:8080/api/products'),
          axios.get('http://localhost:8080/api/users')
        ]);
        const products = productsRes.data;
        const users = usersRes.data;
        setStats({
          totalProducts: products.length,
          totalUsers: users.length,
          lowStockProducts: products.filter(p => p.stock < 10).length
        });
      } catch (error) { console.error("Error fetching dashboard stats:", error); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner />; // <-- Usar el spinner
  }

  return (
    <div className="admin-dashboard-container">
      <h2>Dashboard Administrativo</h2>
      <div className="stats-grid">
        <div className="stat-card"><h3>Total de Productos</h3><p>{stats.totalProducts}</p></div>
        <div className="stat-card"><h3>Total de Usuarios</h3><p>{stats.totalUsers}</p></div>
        <div className="stat-card low-stock"><h3>Productos con Stock Bajo (&lt;10)</h3><p>{stats.lowStockProducts}</p></div>
      </div>
    </div>
  );
};