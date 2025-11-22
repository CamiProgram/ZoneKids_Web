import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/components/adminSidebar.css';

export const AdminSidebar = () => {
  const { logout } = useAuth();

  return (
    <nav className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h3>Panel Admin</h3>
      </div>
      <ul className="admin-sidebar-links">
        <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/admin/products">Productos</NavLink></li>
        <li><NavLink to="/admin/users">Usuarios</NavLink></li>
      </ul>
      <div className="admin-sidebar-footer">
        <NavLink to="/" className="sidebar-link-home">Volver a Tienda</NavLink>
        <button onClick={logout} className="sidebar-logout-button">Cerrar Sesión</button>
      </div>
    </nav>
  );
};