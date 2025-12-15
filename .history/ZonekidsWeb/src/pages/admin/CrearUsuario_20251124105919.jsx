import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
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

    const validateField = (field, value) => {
        switch (field) {
            case 'nombre':
                return value.trim() !== '';
            case 'email':
                return /\S+@\S+\.\S+/.test(value);
            case 'contrasena':
                return value.length >= 8;
            default:
                return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validar campos
        if (!validateField('nombre', nombre)) {
            setError('El nombre es obligatorio.');
            return;
        }
        if (!validateField('email', email)) {
            setError('El email no es válido.');
            return;
        }
        if (!validateField('contrasena', contrasena)) {
            setError('La contraseña debe tener mínimo 8 caracteres.');
            return;
        }

        setLoading(true);

        try {
            const userData = { 
                nombre, 
                email, 
                contrasena, 
                rol: rol.toLowerCase(),  // Asegurar que está en minúsculas
                estado 
            };
            console.log('📝 Creando usuario:', userData);
            await userService.create(userData);
            alert('¡Usuario creado exitosamente!');
            navigate('/admin/users');
        } catch (err) {
            const errorMessage = typeof err === 'string' ? err : err.message || 'Error al guardar el usuario.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-container">
            <h2>Crear Nuevo Usuario</h2>
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
                    <label htmlFor="contrasena">Contraseña * (Mínimo 8 caracteres)</label>
                    <input
                        type="password"
                        id="contrasena"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rol">Rol *</label>
                    <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                        <option value="cliente">Cliente</option>
                        <option value="vendedor">Vendedor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>

                <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? 'Guardando...' : 'Crear Usuario'}
                </button>
            </form>
        </div>
    );
};