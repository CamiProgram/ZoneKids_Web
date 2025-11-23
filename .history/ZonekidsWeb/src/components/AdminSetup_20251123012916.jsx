import React from 'react';
import { useAuth } from '../context/AuthContext';

export const AdminSetup = () => {
  const { user, setUser } = useAuth();

  const makeAdmin = () => {
    if (user) {
      const adminUser = { ...user, rol: 'ADMIN' };
      localStorage.setItem('authUser', JSON.stringify(adminUser));
      // Reload to apply changes
      window.location.reload();
    }
  };

  // Solo mostrar si es el email específico y está en desarrollo
  if (!user || user.email !== 'camilotapia828@gmail.com') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#ff9ec5',
      padding: '15px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      zIndex: 999,
    }} onClick={makeAdmin}>
      Activar Admin
    </div>
  );
};
