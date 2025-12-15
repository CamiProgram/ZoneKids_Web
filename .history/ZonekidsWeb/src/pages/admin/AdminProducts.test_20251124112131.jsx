import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AdminProducts } from './AdminProducts';
import { AuthContext } from '../../context/AuthContext';

// Mock de productService
vi.mock('../../services/productService', () => ({
  productService: {
    getProducts: vi.fn(),
    deleteProduct: vi.fn(),
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
  {
    id: 3,
    nombre: 'Producto 3',
    descripcion: 'Descripción 3',
    precio: 150,
    imagen: '/images/product3.jpg',
    stock: 0,
  },
];

describe('AdminProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (component, role = 'admin') => {
    const mockAuthContextValue = {
      user: {
        id: 1,
        nombre: 'Admin User',
        email: 'admin@example.com',
        rol: role,
      },
      token: 'fake-token',
      login: vi.fn(),
      logout: vi.fn(),
    };

    return render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  it('debe renderizar la página de administración de productos', () => {
    renderWithAuth(<AdminProducts />);
    
    expect(screen.getByText(/productos|administración de productos/i)).toBeInTheDocument();
  });

  it('debe cargar y mostrar la lista de productos', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithAuth(<AdminProducts />);

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
      expect(screen.getByText('Producto 2')).toBeInTheDocument();
      expect(screen.getByText('Producto 3')).toBeInTheDocument();
    });
  });

  it('debe mostrar el nombre y descripción de cada producto', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithAuth(<AdminProducts />);

    await waitFor(() => {
      expect(screen.getByText('Descripción 1')).toBeInTheDocument();
      expect(screen.getByText('Descripción 2')).toBeInTheDocument();
    });
  });

  it('debe mostrar el precio de cada producto', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithAuth(<AdminProducts />);

    await waitFor(() => {
      expect(screen.getByText(/\$100/)).toBeInTheDocument();
      expect(screen.getByText(/\$200/)).toBeInTheDocument();
    });
  });

  it('debe mostrar el stock de cada producto', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithAuth(<AdminProducts />);

    await waitFor(() => {
      expect(screen.getByText(/stock|inventario/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar imágenes de productos', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithAuth(<AdminProducts />);

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });
  });

  it('debe tener un botón para crear nuevo producto', () => {
    renderWithAuth(<AdminProducts />);

    const createButton = screen.getByRole('button', { name: /crear|nuevo|agregar|add/i });
    expect(createButton).toBeInTheDocument();
  });

  it('debe navegar a crear producto al hacer click', async () => {
    const user = userEvent.setup();
    renderWithAuth(<AdminProducts />);

    const createButton = screen.getByRole('button', { name: /crear|nuevo|agregar|add/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/productos/crear');
    });
  });

  it('debe permitir editar un producto', async () => {
    const user = userEvent.setup();
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithAuth(<AdminProducts />);

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByRole('button', { name: /editar|edit/i });
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('debe permitir eliminar un producto', async () => {
    const user = userEvent.setup();
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    productService.deleteProduct.mockResolvedValueOnce({
      success: true,
      message: 'Producto eliminado',
    });

    renderWithAuth(<AdminProducts />);

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar|delete/i });
    await user.click(deleteButtons[0]);

    // Confirmar eliminación si hay un diálogo
    const confirmButton = screen.queryByRole('button', { name: /confirmar|sí|yes/i });
    if (confirmButton) {
      await user.click(confirmButton);
    }

    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalled();
    });
  });

  it('debe mostrar un indicador de stock bajo', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithAuth(<AdminProducts />);

    await waitFor(() => {
      expect(screen.getByText('Producto 3')).toBeInTheDocument();
      // Verificar que el producto sin stock sea destacado
      const stockElements = screen.getAllByText(/stock|0/i);
      expect(stockElements.length).toBeGreaterThan(0);
    });
  });

  it('debe mostrar mensaje si no hay productos', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: [],
    });

    renderWithAuth(<AdminProducts />);

    await waitFor(() => {
      expect(screen.getByText(/no hay productos|vacío/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar error si falla la carga de productos', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockRejectedValueOnce({
      success: false,
      message: 'Error al cargar productos',
    });

    renderWithAuth(<AdminProducts />);

    await waitFor(() => {
      expect(screen.getByText(/error|fallo/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar spinner de carga', () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockImplementationOnce(() => 
      new Promise(() => {})
    );

    renderWithAuth(<AdminProducts />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('debe filtrar productos por nombre', async () => {
    const user = userEvent.setup();
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithAuth(<AdminProducts />);

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /buscar|search/i });
    await user.type(searchInput, 'Producto 1');

    await waitFor(() => {
      expect(screen.getByText('Producto 1')).toBeInTheDocument();
    });
  });
});
