import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/crearUsuario.css'; 

export const CrearUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState('cliente');
    const [estado, setEstado] = useState('activo');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        const userData = { nombre, email, contrasena, rol, estado };
        try {
            await axios.post('http://localhost:8080/api/users', userData); 
            navigate('/admin/users');
        } catch (err) { setError(err.response?.data || 'Error al guardar el usuario.'); } 
        finally { setLoading(false); }
    };

    return (
        <div className="admin-form-container">
            <h2>Crear Nuevo Usuario</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="form-error">{error}</p>}
                <div className="form-group"><label htmlFor="nombre">Nombre Completo</label><input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
                <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div className="form-group"><label htmlFor="contrasena">Contraseña</label><input type="password" id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required /></div>
                <div className="form-group"><label htmlFor="rol">Rol</label><select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}><option value="cliente">Cliente</option><option value="vendedor">Vendedor</option><option value="super-admin">Super Admin</option></select></div>
                <div className="form-group"><label htmlFor="estado">Estado</label><select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></div>
                <button type="submit" disabled={loading} className="btn-submit">{loading ? 'Guardando...' : 'Crear Usuario'}</button>
            </form>
        </div>
    );
};