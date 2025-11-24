import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { userService } from '../../services/userService';
import '../../styles/pages/adminUsers.css';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('👥 Cargando usuarios...');
      
      const data = await userService.getAll();
      console.log('✅ Usuarios cargados:', data?.length || 0);
      console.log('📋 Usuarios:', data);
      setUsers(data);
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      console.error('📋 Error response:', err.response?.data);
      console.error('📊 Error status:', err.response?.status);
      
      // Mostrar mensajes de error específicos
      if (err.response?.status === 403) {
        setError('❌ No tienes permisos para acceder a los usuarios. Verifica tu rol (debe ser ADMIN).');
      } else if (err.response?.status === 401) {
        setError('❌ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError('❌ Error al cargar usuarios. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleEstado = async (userToUpdate) => {
    const nuevoEstado = userToUpdate.estado === 'activo' ? 'inactivo' : 'activo';
    const actionVerb = nuevoEstado === 'inactivo' ? 'deshabilitar' : 'habilitar';

    if (window.confirm(`¿${actionVerb} a ${userToUpdate.nombre}?`)) {
      try {
        console.log(`🔄 Iniciando cambio de estado para usuario: ${userToUpdate.nombre}`);
        
        // Usar el nuevo método changeEstado
        await userService.changeEstado(userToUpdate.id, nuevoEstado);
        
        console.log(`✅ Usuario ${userToUpdate.nombre} ${actionVerb}do correctamente`);
        
        // Recargar la lista de usuarios
        await fetchUsers();
        
        alert(`✅ Usuario ${actionVerb}do correctamente`);
      } catch (err) {
        console.error('❌ Error al cambiar estado del usuario:', err);
        
        let errorMessage = `Error al ${actionVerb} el usuario.`;
        if (typeof err === 'string') {
          errorMessage = err;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        alert(errorMessage);
      }
    }
  };

  const filteredUsers = users.filter(
    u =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-table-container">
      <h2>Gestión de Usuarios</h2>
      <Link to="/admin/users/crear" className="btn-create-link">
        + Crear Nuevo Usuario
      </Link>
      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        className="admin-search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="table-responsive-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td data-label="ID">{user.id}</td>
                <td data-label="Nombre">{user.nombre}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Rol">{user.rol}</td>
                <td
                  data-label="Estado"
                  className={user.estado === 'inactivo' ? 'estado-inactivo' : ''}
                >
                  <span className={`status-badge ${user.estado}`}>{user.estado}</span>
                </td>
                <td data-label="Acciones">
                  <Link to={`/admin/users/editar/${user.id}`} className="btn-edit">
                    Editar
                  </Link>
                  <button
                    onClick={() => handleToggleEstado(user)}
                    className={
                      user.estado === 'activo' ? 'btn-disable' : 'btn-enable'
                    }
                  >
                    {user.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};