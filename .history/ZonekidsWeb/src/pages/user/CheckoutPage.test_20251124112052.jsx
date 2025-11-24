import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { CheckoutPage } from './CheckoutPage';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

// Mock de la API
vi.mock('../../services/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCartItems = [
  {
    id: 1,
    nombre: 'Producto 1',
    precio: 100,
    imagen: '/images/product1.jpg',
    cantidad: 2,
  },
  {
    id: 2,
    nombre: 'Producto 2',
    precio: 50,
    imagen: '/images/product2.jpg',
    cantidad: 1,
  },
];

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (component, cartItems = mockCartItems) => {
    const mockAuthContextValue = {
      user: {
        id: 1,
        nombre: 'Test User',
        email: 'test@example.com',
      },
      token: 'fake-token',
      login: vi.fn(),
      logout: vi.fn(),
    };

    const mockCartContextValue = {
      cart: cartItems,
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
    };

    return render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <CartContext.Provider value={mockCartContextValue}>
          <BrowserRouter>
            {component}
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );
  };

  it('debe renderizar la página de checkout', () => {
    renderWithProviders(<CheckoutPage />);
    
    expect(screen.getByText(/checkout|carrito|compra/i)).toBeInTheDocument();
  });

  it('debe mostrar los items del carrito', async () => {
    renderWithProviders(<CheckoutPage />);

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
      expect(screen.getByText('Producto 2')).toBeInTheDocument();
    });
  });

  it('debe mostrar el total del carrito', async () => {
    renderWithProviders(<CheckoutPage />);

    // Total: (100 * 2) + (50 * 1) = 250
    await waitFor(() => {
      expect(screen.getByText(/\$250/)).toBeInTheDocument();
    });
  });

  it('debe mostrar la cantidad de cada producto', async () => {
    renderWithProviders(<CheckoutPage />);

    await waitFor(() => {
      const quantities = screen.getAllByDisplayValue(/2|1/);
      expect(quantities.length).toBeGreaterThan(0);
    });
  });

  it('debe permitir cambiar la cantidad de un producto', async () => {
    const user = userEvent.setup();
    const mockUpdateQuantity = vi.fn();

    const mockAuthContextValue = {
      user: {
        id: 1,
        nombre: 'Test User',
        email: 'test@example.com',
      },
      token: 'fake-token',
      login: vi.fn(),
      logout: vi.fn(),
    };

    const mockCartContextValue = {
      cart: mockCartItems,
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      clearCart: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <CartContext.Provider value={mockCartContextValue}>
          <BrowserRouter>
            <CheckoutPage />
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    const quantityInput = screen.getAllByRole('spinbutton')[0];
    await user.clear(quantityInput);
    await user.type(quantityInput, '5');

    await waitFor(() => {
      expect(mockUpdateQuantity).toHaveBeenCalled();
    });
  });

  it('debe permitir eliminar un producto del carrito', async () => {
    const user = userEvent.setup();
    const mockRemoveFromCart = vi.fn();

    const mockAuthContextValue = {
      user: {
        id: 1,
        nombre: 'Test User',
        email: 'test@example.com',
      },
      token: 'fake-token',
      login: vi.fn(),
      logout: vi.fn(),
    };

    const mockCartContextValue = {
      cart: mockCartItems,
      addToCart: vi.fn(),
      removeFromCart: mockRemoveFromCart,
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <CartContext.Provider value={mockCartContextValue}>
          <BrowserRouter>
            <CheckoutPage />
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar|delete/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockRemoveFromCart).toHaveBeenCalled();
    });
  });

  it('debe mostrar el formulario de dirección de envío', () => {
    renderWithProviders(<CheckoutPage />);

    expect(screen.getByLabelText(/dirección|address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ciudad|city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/código postal|zip/i)).toBeInTheDocument();
  });

  it('debe permitir rellenar el formulario de dirección', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CheckoutPage />);

    const addressInput = screen.getByLabelText(/dirección|address/i);
    const cityInput = screen.getByLabelText(/ciudad|city/i);

    await user.type(addressInput, 'Calle Principal 123');
    await user.type(cityInput, 'Santiago');

    expect(addressInput).toHaveValue('Calle Principal 123');
    expect(cityInput).toHaveValue('Santiago');
  });

  it('debe tener un botón para confirmar la compra', () => {
    renderWithProviders(<CheckoutPage />);

    const confirmButton = screen.getByRole('button', { name: /confirmar|pagar|comprar/i });
    expect(confirmButton).toBeInTheDocument();
  });

  it('debe deshabilitar el botón si el carrito está vacío', () => {
    renderWithProviders(<CheckoutPage />, []);

    const confirmButton = screen.queryByRole('button', { name: /confirmar|pagar|comprar/i });
    if (confirmButton) {
      expect(confirmButton).toBeDisabled();
    }
  });

  it('debe mostrar un mensaje si el carrito está vacío', () => {
    renderWithProviders(<CheckoutPage />, []);

    expect(screen.getByText(/carrito vacío|no hay productos/i)).toBeInTheDocument();
  });

  it('debe procesár el checkout correctamente', async () => {
    const user = userEvent.setup();
    const api = vi.mocked(require('../../services/api').api);
    
    api.post.mockResolvedValueOnce({
      success: true,
      message: 'Compra realizada exitosamente',
      orderId: 123,
    });

    renderWithProviders(<CheckoutPage />);

    const addressInput = screen.getByLabelText(/dirección|address/i);
    const confirmButton = screen.getByRole('button', { name: /confirmar|pagar|comprar/i });

    await user.type(addressInput, 'Calle Principal 123');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });

  it('debe mostrar error si falla el checkout', async () => {
    const user = userEvent.setup();
    const api = vi.mocked(require('../../services/api').api);
    
    api.post.mockRejectedValueOnce({
      success: false,
      message: 'Error en el procesamiento del pago',
    });

    renderWithProviders(<CheckoutPage />);

    const confirmButton = screen.getByRole('button', { name: /confirmar|pagar|comprar/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/error|fallo/i)).toBeInTheDocument();
    });
  });
});
