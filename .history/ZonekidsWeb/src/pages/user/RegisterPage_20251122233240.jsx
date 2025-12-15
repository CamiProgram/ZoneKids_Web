import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import '../../styles/pages/registerPage.css';

export const RegisterPage = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        case 'email':
          if (!value) fieldError = 'El email es obligatorio.';
          else if (!/\S+@\S+\.\S+/.test(value)) fieldError = 'El email no es válido.';
          break;
        case 'password':
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
        const isEmailValid = validateField('email', email);
        const isPasswordValid = validateField('password', password);
        
        if (!isNombreValid || !isEmailValid || !isPasswordValid) {
            setError('Por favor corrige los errores.');
            return;
        }

        setLoading(true);

        try {
            await authService.register(nombre, email, password);
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            let errorMessage = 'Error al registrar la cuenta.';
            
            if (typeof err === 'string') {
                errorMessage = err;
            } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
                errorMessage = err.response.data.errors[0].defaultMessage;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (typeof err.response?.data === 'string') {
                errorMessage = err.response.data;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
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
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            validateField('password', e.target.value);
                        }}
                        onBlur={(e) => validateField('password', e.target.value)}
                        className={fieldErrors.password ? 'input-error' : ''}
                    />
                    {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
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