import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

// Mock del productService
vi.mock('../../services/productService', () => ({
  productService: {
    getProducts: vi.fn(),
    searchProducts: vi.fn(),
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

const mockProducts = [
  {
    id: 1,
    nombre: 'Producto 1',
    descripcion: 'Descripción 1',
    precio: 100,
    imagen: '/images/product1.jpg',
    stock: 10,
  },
  {
    id: 2,
    nombre: 'Producto 2',
    descripcion: 'Descripción 2',
    precio: 200,
    imagen: '/images/product2.jpg',
    stock: 5,
  },
];

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (component) => {
    const mockAuthContextValue = {
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
    };

    const mockCartContextValue = {
      cart: [],
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

  it('debe renderizar la página principal correctamente', () => {
    renderWithProviders(<HomePage />);
    
    expect(screen.getByText(/bienvenido/i)).toBeInTheDocument();
  });

  it('debe cargar y mostrar productos', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
      expect(screen.getByText('Producto 2')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje de error si falla la carga de productos', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockRejectedValueOnce({
      success: false,
      message: 'Error al cargar productos',
    });

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/error al cargar/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar spinner de carga mientras se cargan los productos', () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockImplementationOnce(() => 
      new Promise(() => {}) // Promise que nunca se resuelve
    );

    renderWithProviders(<HomePage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('debe tener un carrusel de publicidad al inicio', () => {
    renderWithProviders(<HomePage />);
    
    const carousel = screen.getByRole('region', { name: /publicidad|anuncios/i });
    expect(carousel).toBeInTheDocument();
  });

  it('debe mostrar categorías de productos', () => {
    renderWithProviders(<HomePage />);
    
    expect(screen.getByText(/categorías/i)).toBeInTheDocument();
  });

  it('debe permitir navegar a la página de un producto al hacer click', async () => {
    const { productService } = await import('../../services/productService');
    
    vi.mocked(productService.getProducts).mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      const productLink = screen.getByRole('link', { name: /Producto 1/i });
      expect(productLink).toBeInTheDocument();
    });
  });

  it('debe mostrar precios de los productos correctamente', async () => {
    const { productService } = await import('../../services/productService');
    
    vi.mocked(productService.getProducts).mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithProviders(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/\$100/)).toBeInTheDocument();
      expect(screen.getByText(/\$200/)).toBeInTheDocument();
    });
  });

  it('debe tener un footer visible', () => {
    renderWithProviders(<HomePage />);
    
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
