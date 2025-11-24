import React from 'react';
import { useDiagnostics } from '../hooks/useDiagnostics';

/**
 * Componente de diagnóstico para verificar estado de autenticación
 * Solo visible en desarrollo (comentado para producción)
 */
export const AuthDiagnostic = () => {
  const { getAuthStatus, printDiagnostics, clearAuth } = useDiagnostics();
  const [showDiagnostics, setShowDiagnostics] = React.useState(false);
  const status = getAuthStatus();

  const handlePrint = () => {
    printDiagnostics();
    alert('Diagnóstico impreso en la consola. Abre DevTools (F12) para verlo.');
  };

  const handleClear = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar la autenticación?')) {
      clearAuth();
      window.location.reload();
    }
  };

  if (!showDiagnostics) {
    return (
      <button
        onClick={() => setShowDiagnostics(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '8px 12px',
          fontSize: '12px',
          backgroundColor: '#666',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 9999,
        }}
      >
        🔍 Diagnóstico
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#1a1a1a',
        color: '#00ff00',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        maxWidth: '400px',
        border: '2px solid #00ff00',
        zIndex: 10000,
        boxShadow: '0 0 20px rgba(0,255,0,0.3)',
      }}
    >
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        🔍 DIAGNÓSTICO AUTH
        <button
          onClick={() => setShowDiagnostics(false)}
          style={{
            float: 'right',
            backgroundColor: 'transparent',
            color: '#00ff00',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Token:</strong> {status.token.present ? '✅ Presente' : '❌ No presente'}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Email:</strong> {status.user.email}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Rol:</strong> {status.user.rol}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>ID:</strong> {status.user.id}
      </div>

      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        <button
          onClick={handlePrint}
          style={{
            flex: 1,
            padding: '6px',
            backgroundColor: '#00ff00',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
          }}
        >
          📋 Copiar
        </button>
        <button
          onClick={handleClear}
          style={{
            flex: 1,
            padding: '6px',
            backgroundColor: '#ff3333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
          }}
        >
          🗑️ Limpiar
        </button>
      </div>
    </div>
  );
};
