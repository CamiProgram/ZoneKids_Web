import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import '../../styles/pages/crearUsuario.css';

export const CrearUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState('cliente');
    const [estado, setEstado] = useState('activo');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    
    // Verificar si el usuario actual es el jefe
    const isJefe = authService.isJefe();

    const validateField = (field, value) => {
        let fieldError = '';
        switch (field) {
            case 'nombre':
                if (!value.trim()) fieldError = 'El nombre es obligatorio.';
                else if (value.trim().length < 3) fieldError = 'Mínimo 3 caracteres.';
                break;
            case 'email':
                if (!value.trim()) fieldError = 'El email es obligatorio.';
                else if (!/\S+@\S+\.\S+/.test(value)) fieldError = 'El email no es válido.';
                break;
            case 'contrasena':
                if (!value) fieldError = 'La contraseña es obligatoria.';
                else if (value.length < 8) fieldError = 'Mínimo 8 caracteres.';
                break;
            default:
                break;
        }
        setFieldErrors(prev => ({ ...prev, [field]: fieldError }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validar campos
        validateField('nombre', nombre);
        validateField('email', email);
        validateField('contrasena', contrasena);

        // Si hay errores, no enviar
        if (fieldErrors.nombre || fieldErrors.email || fieldErrors.contrasena) {
            setError('Por favor, corrige los errores en el formulario.');
            return;
        }

        // Validar que solo el jefe pueda crear admins
        if (rol === 'admin' && !isJefe) {
            setError('❌ Solo el administrador jefe puede crear usuarios con rol ADMIN.');
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
            console.log('   - Usuario actual es jefe:', isJefe);
            console.log('   - Rol a crear:', userData.rol);
            
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
                        onChange={(e) => {
                            setNombre(e.target.value);
                            validateField('nombre', e.target.value);
                        }}
                        onBlur={(e) => validateField('nombre', e.target.value)}
                        className={fieldErrors.nombre ? 'input-error' : ''}
                        required
                    />
                    {fieldErrors.nombre && <span className="field-error">{fieldErrors.nombre}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            validateField('email', e.target.value);
                        }}
                        onBlur={(e) => validateField('email', e.target.value)}
                        className={fieldErrors.email ? 'input-error' : ''}
                        required
                    />
                    {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="contrasena">Contraseña * (Mínimo 8 caracteres)</label>
                    <input
                        type="password"
                        id="contrasena"
                        value={contrasena}
                        onChange={(e) => {
                            setContrasena(e.target.value);
                            validateField('contrasena', e.target.value);
                        }}
                        onBlur={(e) => validateField('contrasena', e.target.value)}
                        className={fieldErrors.contrasena ? 'input-error' : ''}
                        required
                    />
                    {fieldErrors.contrasena && <span className="field-error">{fieldErrors.contrasena}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="rol">Rol *</label>
                    {isJefe ? (
                        <>
                            <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                                <option value="cliente">Cliente</option>
                                <option value="vendedor">Vendedor</option>
                                <option value="admin">Admin</option>
                            </select>
                            <small style={{ color: '#0c5aa0', marginTop: '4px', display: 'block' }}>
                                ✓ Tienes permisos para asignar cualquier rol.
                            </small>
                        </>
                    ) : (
                        <>
                            <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                                <option value="cliente">Cliente</option>
                                <option value="vendedor">Vendedor</option>
                            </select>
                            <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                                ℹ️ Solo puedes crear usuarios con rol Cliente o Vendedor.
                            </small>
                        </>
                    )}
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