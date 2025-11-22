import React from 'react';
import '../styles/components/loadingSpinner.css'; // Crearemos este CSS

export const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-box">
        {/* Asegúrate que la ruta al GIF sea correcta desde la carpeta public */}
        <img src="/estrella.gif" alt="Cargando..." />
        <p>Cargando...</p>
      </div>
    </div>
  );
};