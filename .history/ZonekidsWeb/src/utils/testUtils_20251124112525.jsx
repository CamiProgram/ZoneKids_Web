import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export const renderWithContexts = (component, options = {}) => {
  const {
    authValue = {
      user: null,
      token: null,
      login: () => {},
      logout: () => {},
    },
    cartValue = {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
    },
  } = options;

  return render(
    <AuthContext.Provider value={authValue}>
      <CartContext.Provider value={cartValue}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};
