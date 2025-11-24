import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { userService } from '../../services/userService';
import '../../styles/pages/editarUsuario.css';

export const EditarUsuario = () => {
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('cliente');
    const [estado, setEstado] = useState('activo');
    const [rawPassword, setRawPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
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
                setRawPassword(''); // Campo de contraseña vacío al cargar
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
            console.log('📝 Iniciando actualización de usuario...');
            console.log('  - Nombre:', nombre);
            console.log('  - Email:', email);
            console.log('  - Rol (NO se envía):', rol);
            console.log('  - Estado:', estado);
            console.log('  - Password: ', rawPassword ? '(proporcionada)' : '(no proporcionada)');
            
            // Actualizar nombre, email y contraseña
            // El rol se ignora en el PUT, solo se envían nombre, email y rawPassword
            const userData = { 
                nombre, 
                email, 
                estado,
                rawPassword: rawPassword || ''
            };
            
            console.log('📤 Datos a enviar a userService.update():', JSON.stringify(userData, null, 2));
            console.log('   ¿Contiene ROL?:', 'rol' in userData);
            
            const updatedUser = await userService.update(id, userData);
            
            console.log('✅ Usuario actualizado:', updatedUser);
            alert('¡Usuario actualizado exitosamente!');
            navigate('/admin/users');
        } catch (err) {
            console.error('❌ Error al actualizar:', err);
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
                    <label htmlFor="rawPassword">Contraseña (dejar vacío para no cambiar)</label>
                    <input
                        type="password"
                        id="rawPassword"
                        value={rawPassword}
                        onChange={(e) => setRawPassword(e.target.value)}
                        placeholder="Nueva contraseña (opcional)"
                    />
                    <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                        Si dejas este campo vacío, la contraseña no se cambiará.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="rol">Rol (Solo lectura - No se puede cambiar)</label>
                    <input
                        type="text"
                        id="rol"
                        value={rol === 'cliente' ? 'Cliente' : rol === 'vendedor' ? 'Vendedor' : 'Admin'}
                        disabled
                        readOnly
                    />
                    <small style={{ color: '#999', marginTop: '4px', display: 'block' }}>
                        El rol de un usuario solo puede ser modificado por el administrador del sistema.
                    </small>
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