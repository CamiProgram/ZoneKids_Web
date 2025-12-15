import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito al cambiar de usuario
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    } else {
      setCartItems([]);
    }
  }, [user?.id]);

  // Guardar carrito cuando cambia
  useEffect(() => {
    if (user && cartItems.length > 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    } else if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  }, [cartItems, user?.id]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
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
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, cantidad: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.precio * (item.cantidad || 1));
    }, 0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems,
      addToCart, 
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      isCartOpen, 
      openCart, 
      closeCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};