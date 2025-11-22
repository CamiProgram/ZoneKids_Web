import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner'; // <-- Importar
import '../../styles/pages/adminUsers.css';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try { setLoading(true); setError(null); const response = await axios.get('http://localhost:8080/api/users'); setUsers(response.data); }
    catch (err) { console.error("Error fetching users:", err); setError("Error al cargar usuarios."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleEstado = async (userToUpdate) => {
    const nuevoEstado = userToUpdate.estado === 'activo' ? 'inactivo' : 'activo';
    const actionVerb = nuevoEstado === 'inactivo' ? 'deshabilitar' : 'habilitar';
    if (window.confirm(`¿${actionVerb} a ${userToUpdate.nombre}?`)) {
      try {
        const updatedUserData = { ...userToUpdate, estado: nuevoEstado };
        await axios.put(`http://localhost:8080/api/users/${userToUpdate.id}`, updatedUserData);
        fetchUsers();
      } catch (err) { alert(`Error al ${actionVerb} el usuario.`); }
    }
  };

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return <LoadingSpinner />; // <-- Usar el spinner
  }
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-table-container">
      <h2>Gestión de Usuarios</h2>
      <Link to="/admin/users/crear" className="btn-create-link"> + Crear Nuevo Usuario </Link>
      <input type="text" placeholder="Buscar por nombre o email..." className="admin-search-bar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <div className="table-responsive-wrapper">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td data-label="ID">{user.id}</td>
                <td data-label="Nombre">{user.nombre}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Rol">{user.rol}</td>
                <td data-label="Estado" className={user.estado === 'inactivo' ? 'estado-inactivo' : ''}>{user.estado}</td>
                <td data-label="Acciones">
                  <Link to={`/admin/users/editar/${user.id}`} className="btn-edit">Editar</Link>
                  <button onClick={() => handleToggleEstado(user)} className={user.estado === 'activo' ? 'btn-disable' : 'btn-enable'}>{user.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};