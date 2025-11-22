import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/pages/editarUsuario.css'; 

export const EditarUsuario = () => {
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('');
    const [estado, setEstado] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}`);
                const user = response.data;
                setNombre(user.nombre); setEmail(user.email); setRol(user.rol); setEstado(user.estado);
            } catch (err) { setError("No se pudo cargar el usuario."); }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        const userData = { nombre, email, rol, estado };
        try {
            await axios.put(`http://localhost:8080/api/users/${id}`, userData);
            navigate('/admin/users');
        } catch (err) { setError(err.response?.data || 'Error al actualizar.'); } 
        finally { setLoading(false); }
    };

    return (
        <div className="admin-form-container">
            <h2>Editar Usuario (ID: {id})</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="form-error">{error}</p>}
                <div className="form-group"><label htmlFor="nombre">Nombre Completo</label><input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></div>
                <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div className="form-group"><label htmlFor="rol">Rol</label><select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}><option value="cliente">Cliente</option><option value="vendedor">Vendedor</option><option value="super-admin">Super Admin</option></select></div>
                <div className="form-group"><label htmlFor="estado">Estado</label><select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></div>
                <button type="submit" disabled={loading} className="btn-submit">{loading ? 'Actualizando...' : 'Actualizar Usuario'}</button>
            </form>
        </div>
    );
};