import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import '../../styles/pages/registerPage.css';

export const RegisterPage = () => {
    const [nombre, setNombre] = useState('');
    const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateField = (name, value) => {
      let fieldError = '';
      switch (name) {
        case 'nombre':
          if (!value) fieldError = 'El nombre es obligatorio.';
          break;
        case 'rut':
          if (!value) fieldError = 'El RUT es obligatorio.';
          else if (!/^\d{9}$/.test(value.replace(/[.\-]/g, ''))) fieldError = 'El RUT debe tener 9 dígitos.';
          break;
        case 'email':
          if (!value) fieldError = 'El email es obligatorio.';
          else if (!/\S+@\S+\.\S+/.test(value)) fieldError = 'El email no es válido.';
          break;
        case 'contrasena':
          if (!value) fieldError = 'La contraseña es obligatoria.';
          else if (value.length < 8) fieldError = 'Mínimo 8 caracteres.';
          break;
        default:
          break;
      }
      setFieldErrors(prev => ({ ...prev, [name]: fieldError }));
      return fieldError === '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const isNombreValid = validateField('nombre', nombre);
        const isRutValid = validateField('rut', rut);
        const isEmailValid = validateField('email', email);
        const isPasswordValid = validateField('contrasena', contrasena);
        
        if (!isNombreValid || !isRutValid || !isEmailValid || !isPasswordValid) {
            setError('Por favor corrige los errores.');
            return;
        }

        setLoading(true);

        try {
            console.log('📝 Iniciando registro...');
            console.log('👤 Datos:', { nombre, rut, email });
            
            // Registrar nuevo usuario (rol CLIENTE automático)
            const usuarioCreado = await authService.register(nombre, email, contrasena);
            
            console.log('✅ Registro exitoso');
            console.log('👤 Usuario creado:', usuarioCreado);
            
            alert('✅ ¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            console.error('❌ Error en registro:', err);
            
            let errorMessage = 'Error al registrar la cuenta.';
            
            // Diferentes formas en que el backend puede retornar el error
            if (typeof err === 'string') {
                errorMessage = err;
            } else if (err.message && typeof err.message === 'string') {
                errorMessage = err.message;
            } else if (err.errors && Array.isArray(err.errors)) {
                errorMessage = err.errors[0].defaultMessage || err.errors[0];
            } else if (err.detail) {
                errorMessage = err.detail;
            }
            
            console.error('📋 Mensaje de error:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Crear Cuenta</h2>
                {error && <p className="register-error">{error}</p>}
                <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo</label>
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
                    />
                    {fieldErrors.nombre && <span className="field-error">{fieldErrors.nombre}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="rut">RUT (9 dígitos)</label>
                    <input
                        type="text"
                        id="rut"
                        placeholder="123456789"
                        value={rut}
                        onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(/\D/g, '');
                            setRut(onlyNumbers.slice(0, 9));
                            validateField('rut', onlyNumbers);
                        }}
                        onBlur={(e) => validateField('rut', e.target.value)}
                        className={fieldErrors.rut ? 'input-error' : ''}
                        maxLength="9"
                    />
                    {fieldErrors.rut && <span className="field-error">{fieldErrors.rut}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
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
                    />
                    {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="contrasena">Contraseña</label>
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
                    />
                    {fieldErrors.contrasena && <span className="field-error">{fieldErrors.contrasena}</span>}
                </div>
                <button type="submit" disabled={loading} className="register-button">
                    {loading ? 'Registrando...' : 'Crear Cuenta'}
                </button>
                <p className="login-link">
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
};