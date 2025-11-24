import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import '../../styles/pages/loginPage.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let fieldError = '';
    switch (name) {
      case 'email':
        if (!value) fieldError = 'El email es obligatorio.';
        else if (!/\S+@\S+\.\S+/.test(value)) fieldError = 'El email no es válido.';
        break;
      case 'password':
        if (!value) fieldError = 'La contraseña es obligatoria.';
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

    const isEmailValid = validateField('email', email);
    const isPasswordValid = validateField('password', password);
    
    if (!isEmailValid || !isPasswordValid) {
      setError('Por favor corrige los errores.');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Iniciando login...');
      console.log('📧 Email:', email);
      
      const user = await login(email, password);
      
      console.log('✅ Login exitoso');
      console.log('👤 Usuario:', { email: user.email, rol: user.rol, nombre: user.nombre });
      console.log('🎯 Rol detected:', user.rol);
      
      // Redirigir según el rol del usuario
      if (user && user.rol === 'ADMIN') {
        console.log('➡️ Redirigiendo a /admin/dashboard');
        navigate('/admin/dashboard');
      } else if (user && user.rol === 'VENDEDOR') {
        console.log('➡️ Redirigiendo a / (VENDEDOR)');
        navigate('/');
      } else if (user && user.rol === 'CLIENTE') {
        console.log('➡️ Redirigiendo a / (CLIENTE)');
        navigate('/');
      } else {
        console.log('➡️ Redirigiendo a / (default)');
        navigate('/');
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
      
      let errorMessage = 'Error al iniciar sesión. Intente más tarde.';
      
      // Diferentes formas en que el backend puede retornar el error
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err.message && typeof err.message === 'string') {
        errorMessage = err.message;
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
    <div className="login-page-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        {error && <p className="login-error">{error}</p>}
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
            required
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
            required
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        )}
        <p className="register-link">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};