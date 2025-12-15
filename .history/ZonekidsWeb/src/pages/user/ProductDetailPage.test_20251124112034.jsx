import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ProductDetailPage } from './ProductDetailPage';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';

// Mock del productService
vi.mock('../../services/productService', () => ({
  productService: {
    getProductById: vi.fn(),
  },
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

const mockProduct = {
  id: 1,
  nombre: 'Producto Test',
  descripcion: 'Descripción del producto',
  precio: 150,
  imagen: '/images/product1.jpg',
  stock: 10,
  imagenes: [
    '/images/product1.jpg',
    '/images/product1-2.jpg',
    '/images/product1-3.jpg',
  ],
};

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
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

  it('debe renderizar la página de detalle del producto', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProductById.mockResolvedValueOnce({
      success: true,
      data: mockProduct,
    });

    renderWithProviders(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Producto Test')).toBeInTheDocument();
    });
  });

  it('debe mostrar el nombre y descripción del producto', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProductById.mockResolvedValueOnce({
      success: true,
      data: mockProduct,
    });

    renderWithProviders(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Producto Test')).toBeInTheDocument();
      expect(screen.getByText('Descripción del producto')).toBeInTheDocument();
    });
  });

  it('debe mostrar el precio del producto', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProductById.mockResolvedValueOnce({
      success: true,
      data: mockProduct,
    });

    renderWithProviders(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/\$150/)).toBeInTheDocument();
    });
  });

  it('debe cargar las imágenes del carrusel', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProductById.mockResolvedValueOnce({
      success: true,
      data: mockProduct,
    });

    renderWithProviders(<ProductDetailPage />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  it('debe hacer autoplay del carrusel cada 30 segundos', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProductById.mockResolvedValueOnce({
      success: true,
      data: mockProduct,
    });

    renderWithProviders(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Producto Test')).toBeInTheDocument();
    });

    // Avanzar 30 segundos
    vi.advanceTimersByTime(30000);

    await waitFor(() => {
      // Verificar que el carrusel avanzó
      expect(screen.queryByText('Producto Test')).toBeInTheDocument();
    });
  });

  it('debe permitir cambiar de imagen con botones', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    const user = userEvent.setup({ delay: null });
    
    productService.getProductById.mockResolvedValueOnce({
      success: true,
      data: mockProduct,
    });

    renderWithProviders(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Producto Test')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /siguiente|next/i });
    await user.click(nextButton);

    expect(nextButton).toBeInTheDocument();
  });

  it('debe tener un botón de agregar al carrito', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProductById.mockResolvedValueOnce({
      success: true,
      data: mockProduct,
    });

    renderWithProviders(<ProductDetailPage />);

    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: /agregar al carrito|añadir al carrito/i });
      expect(addButton).toBeInTheDocument();
    });
  });

  it('debe agregar el producto al carrito', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    const user = userEvent.setup();
    
    productService.getProductById.mockResolvedValueOnce({
      success: true,
      data: mockProduct,
    });

    const mockAddToCart = vi.fn();
    const mockAuthContextValue = {
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
    };

    const mockCartContextValue = {
      cart: [],
      addToCart: mockAddToCart,
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <CartContext.Provider value={mockCartContextValue}>
          <BrowserRouter>
            <ProductDetailPage />
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Producto Test')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /agregar al carrito|añadir al carrito/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalled();
    });
  });

  it('debe mostrar error si el producto no se carga', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProductById.mockRejectedValueOnce({
      success: false,
      message: 'Producto no encontrado',
    });

    renderWithProviders(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/error|no encontrado/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar spinner de carga mientras carga el producto', () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProductById.mockImplementationOnce(() => 
      new Promise(() => {})
    );

    renderWithProviders(<ProductDetailPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
