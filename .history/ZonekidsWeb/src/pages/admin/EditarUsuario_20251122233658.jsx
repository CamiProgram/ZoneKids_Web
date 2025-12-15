import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { userService } from '../../services/userService';
import '../../styles/pages/editarUsuario.css';

export const EditarUsuario = () => {
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('CLIENTE');
    const [estado, setEstado] = useState('activo');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);
                const user = await userService.getById(id);
                setNombre(user.nombre);
                setEmail(user.email);
                setRol(user.rol);
                setEstado(user.estado);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('No se pudo cargar el usuario.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validar campos
        if (!nombre.trim()) {
            setError('El nombre es obligatorio.');
            return;
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('El email no es válido.');
            return;
        }

        setIsSaving(true);

        try {
            const userData = { nombre, email, rol, estado };
            await userService.update(id, userData);
            alert('¡Usuario actualizado exitosamente!');
            navigate('/admin/users');
        } catch (err) {
            const errorMessage = typeof err === 'string' ? err : err.message || 'Error al actualizar el usuario.';
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="admin-form-container">
            <h2>Editar Usuario (ID: {id})</h2>
            <form onSubmit={handleSubmit}>
                {error && <p className="form-error">{error}</p>}

                <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo *</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rol">Rol</label>
                    <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                        <option value="CLIENTE">Cliente</option>
                        <option value="VENDEDOR">Vendedor</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

                <button type="submit" disabled={isSaving} className="btn-submit">
                    {isSaving ? 'Actualizando...' : 'Actualizar Usuario'}
                </button>
            </form>
        </div>
    );
};