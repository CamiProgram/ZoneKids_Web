/**
 * Hook personalizado para diagnosticar problemas de autenticación y autorización
 * Proporciona información sobre el estado actual del token y del usuario
 */
export const useDiagnostics = () => {
  const getAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    const authUser = localStorage.getItem('authUser');
    const user = authUser ? JSON.parse(authUser) : null;

    const diagnostics = {
      token: {
        present: !!token,
        length: token?.length || 0,
        preview: token ? `${token.substring(0, 20)}...${token.substring(token.length - 20)}` : 'NO TOKEN',
      },
      user: {
        present: !!user,
        email: user?.email || 'N/A',
        rol: user?.rol || 'N/A',
        id: user?.id || 'N/A',
        nombre: user?.nombre || 'N/A',
      },
      allData: {
        token,
        user,
      },
    };

    return diagnostics;
  };

  const printDiagnostics = () => {
    const status = getAuthStatus();
    console.clear();
    console.group('🔍 DIAGNÓSTICO DE AUTENTICACIÓN');
    console.log('=== TOKEN ===');
    console.log('Presente:', status.token.present);
    console.log('Largo:', status.token.length);
    if (status.token.present) console.log('Preview:', status.token.preview);

    console.log('\n=== USUARIO ===');
    console.log('Email:', status.user.email);
    console.log('Rol:', status.user.rol);
    console.log('ID:', status.user.id);
    console.log('Nombre:', status.user.nombre);

    console.log('\n=== DATOS COMPLETOS ===');
    console.log('Token:', status.allData.token);
    console.log('Usuario:', status.allData.user);
    console.groupEnd();

    return status;
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    console.log('✅ Autenticación limpiada');
  };

  return {
    getAuthStatus,
    printDiagnostics,
    clearAuth,
  };
};
