import React from 'react';
import { useAuth } from '../context/AuthContext';

export const AdminSetup = () => {
  const { user, setUserRole } = useAuth();

  const makeAdmin = () => {
    if (user && user.email === 'camilotapia828@gmail.com') {
      setUserRole('ADMIN');
      // Reload to apply changes
      setTimeout(() => window.location.reload(), 500);
    }
  };

  // Solo mostrar si es el email específico
  if (!user || user.email !== 'camilotapia828@gmail.com') {
    return null;
  }

  // Si ya es admin, no mostrar el botón
  if (user.rol === 'ADMIN') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#ff9ec5',
      padding: '12px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: 999,
      border: '2px solid white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      color: 'white'
    }} 
    onClick={makeAdmin}
    onMouseOver={(e) => {
      e.target.style.background = '#ff85b5';
      e.target.style.transform = 'scale(1.05)';
    }}
    onMouseOut={(e) => {
      e.target.style.background = '#ff9ec5';
      e.target.style.transform = 'scale(1)';
    }}
    >
      📌 Activar Admin
    </div>
  );
};
