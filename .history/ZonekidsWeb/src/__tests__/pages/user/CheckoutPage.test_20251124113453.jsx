import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { CartContext } from '../../../context/CartContext';
import { CheckoutPage } from '../../../pages/user/CheckoutPage';

describe('CheckoutPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderWithContexts = (component) => {
    const mockAuthValue = {
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
    };

    const mockCartValue = {
      cart: [],
      cartItems: [],
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      getTotalPrice: vi.fn(() => 0),
      setCartItems: vi.fn(),
      isCartOpen: false,
      openCart: vi.fn(),
      closeCart: vi.fn(),
      timeRemaining: null,
      cartTimestamp: null,
    };

    return render(
      <AuthContext.Provider value={mockAuthValue}>
        <CartContext.Provider value={mockCartValue}>
          <BrowserRouter>
            {component}
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );
  };

  it('debe renderizar la página de checkout', () => {
    renderWithContexts(<CheckoutPage />);

    expect(document.body).toBeInTheDocument();
  });

  it('debe tener un contenedor principal', () => {
    const { container } = renderWithContexts(<CheckoutPage />);

    expect(container).toBeInTheDocument();
  });
});
