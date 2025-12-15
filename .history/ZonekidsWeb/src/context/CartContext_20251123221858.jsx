import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartTimestamp, setCartTimestamp] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedTimestamp = localStorage.getItem('cartTimestamp');
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const timestamp = savedTimestamp ? parseInt(savedTimestamp) : Date.now();
        
        // Verificar si el carrito expiró (24 horas = 86400000 ms)
        const now = Date.now();
        const elapsed = now - timestamp;
        const CART_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas
        
        if (elapsed < CART_EXPIRY) {
          setCart(parsedCart);
          setCartTimestamp(timestamp);
          updateTimeRemaining(timestamp);
        } else {
          // Carrito expirado, limpiar localStorage
          localStorage.removeItem('cart');
          localStorage.removeItem('cartTimestamp');
        }
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (cart.length > 0) {
      const timestamp = cartTimestamp || Date.now();
      setCartTimestamp(timestamp);
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('cartTimestamp', timestamp.toString());
      updateTimeRemaining(timestamp);
    } else {
      localStorage.removeItem('cart');
      localStorage.removeItem('cartTimestamp');
      setTimeRemaining(null);
    }
  }, [cart]);

  // Actualizar contador cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      if (cartTimestamp) {
        updateTimeRemaining(cartTimestamp);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [cartTimestamp]);

  const updateTimeRemaining = (timestamp) => {
    const now = Date.now();
    const elapsed = now - timestamp;
    const CART_EXPIRY = 24 * 60 * 60 * 1000;
    const remaining = CART_EXPIRY - elapsed;

    if (remaining <= 0) {
      clearCart();
      setTimeRemaining(null);
    } else {
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
      setTimeRemaining({
        hours,
        minutes,
        seconds,
        total: remaining
      });
    }
  };

  // Guardar carrito cuando cambia
  useEffect(() => {
    if (user && cart.length > 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    } else if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  }, [cart, user?.id]);

  const addToCart = (product) => {
    setCart(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, cantidad: (item.cantidad || 1) + 1 } : item
        );
      }
      return [...prevItems, { ...product, cantidad: 1 }];
    });
    // Abre el modal cuando se añade un producto
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, cantidad: newQuantity } : item
        )
      );
    }
  };

  const openCart = () => {
    setIsCartOpen(true);
    // Resetear timestamp cuando se abre el carrito (para extender 24h)
    if (cart.length > 0) {
      const newTimestamp = Date.now();
      setCartTimestamp(newTimestamp);
      localStorage.setItem('cartTimestamp', newTimestamp.toString());
    }
  };

  const closeCart = () => setIsCartOpen(false);
  
  const clearCart = () => {
    setCart([]);
    setCartTimestamp(null);
    setTimeRemaining(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartTimestamp');
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.precio * (item.cantidad || 1)), 0);
  };

  const setCartItems = (items) => {
    setCart(items);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems: cart,
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      setCartItems,
      getTotalPrice,
      isCartOpen, 
      openCart, 
      closeCart,
      clearCart,
      timeRemaining,
      cartTimestamp
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};