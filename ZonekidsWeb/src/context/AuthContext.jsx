import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const createAdminUser = async () => {
      try {
        // Intenta crear el usuario admin si no existe
        const adminData = {
          nombre: "Administrador",
          email: "admin@zonekids.com",
          contrasena: "admin123",
          rol: "super-admin",
          estado: "activo"
        };
        
        await axios.post('http://localhost:8080/api/auth/register', adminData);
      } catch (error) {
        // Si el error es porque el usuario ya existe, es normal y podemos ignorarlo
        console.log("Admin ya existe o error al crear:", error.message);
      }
    };

    createAdminUser();
  }, []);

  const login = async (email, password) => {
    try {
      // La llamada al backend ya no requiere el código de seguridad
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, contrasena: password }); 
      if (response.data) {
        const userData = response.data;
        if (userData.estado === 'inactivo') {
          throw new Error("Tu cuenta ha sido deshabilitada."); 
        }
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); 
        return userData;
      }
    } catch (error) {
      console.error("Error en el login:", error.response ? error.response.data : error.message);
      if (error.message === "Tu cuenta ha sido deshabilitada.") {
        throw new Error("Tu cuenta ha sido deshabilitada."); 
      }
      // Re-lanza el mensaje del backend si existe para mostrarlo en el formulario
      throw new Error(error.response?.data || "Credenciales incorrectas.");
    }
    return null; 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};