import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from './AdminDashboard';
import { AuthContext } from '../../context/AuthContext';

// Mock de userService
vi.mock('../../services/userService', () => ({
  userService: {
    getUsers: vi.fn(),
    updateUserStatus: vi.fn(),
  },
}));

// Mock de productService
vi.mock('../../services/productService', () => ({
  productService: {
    getProducts: vi.fn(),
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

const mockUsers = [
  {
    id: 1,
    nombre: 'Usuario 1',
    email: 'user1@example.com',
    rol: 'cliente',
    activo: true,
  },
  {
    id: 2,
    nombre: 'Usuario 2',
    email: 'user2@example.com',
    rol: 'vendedor',
    activo: false,
  },
];

const mockProducts = [
  {
    id: 1,
    nombre: 'Producto 1',
    precio: 100,
    stock: 10,
  },
  {
    id: 2,
    nombre: 'Producto 2',
    precio: 200,
    stock: 5,
  },
];

describe('AdminDashboard', () => {
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

  it('debe renderizar el dashboard de admin', () => {
    renderWithAuth(<AdminDashboard />);
    
    expect(screen.getByText(/dashboard|panel de administración/i)).toBeInTheDocument();
  });

  it('debe mostrar estadísticas de usuarios', async () => {
    const userService = vi.mocked(require('../../services/userService').userService);
    
    userService.getUsers.mockResolvedValueOnce({
      success: true,
      data: mockUsers,
    });

    renderWithAuth(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/usuarios|total/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar estadísticas de productos', async () => {
    const productService = vi.mocked(require('../../services/productService').productService);
    
    productService.getProducts.mockResolvedValueOnce({
      success: true,
      data: mockProducts,
    });

    renderWithAuth(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/productos|inventario/i)).toBeInTheDocument();
    });
  });

  it('debe cargar la lista de usuarios', async () => {
    const userService = vi.mocked(require('../../services/userService').userService);
    
    userService.getUsers.mockResolvedValueOnce({
      success: true,
      data: mockUsers,
    });

    renderWithAuth(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Usuario 1')).toBeInTheDocument();
      expect(screen.getByText('Usuario 2')).toBeInTheDocument();
    });
  });

  it('debe mostrar el email de los usuarios', async () => {
    const userService = vi.mocked(require('../../services/userService').userService);
    
    userService.getUsers.mockResolvedValueOnce({
      success: true,
      data: mockUsers,
    });

    renderWithAuth(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
      expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    });
  });

  it('debe mostrar el rol de cada usuario', async () => {
    const userService = vi.mocked(require('../../services/userService').userService);
    
    userService.getUsers.mockResolvedValueOnce({
      success: true,
      data: mockUsers,
    });

    renderWithAuth(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/cliente|vendedor/i)).toBeInTheDocument();
    });
  });

  it('debe permitir desactivar un usuario', async () => {
    const user = userEvent.setup();
    const userService = vi.mocked(require('../../services/userService').userService);
    
    userService.getUsers.mockResolvedValueOnce({
      success: true,
      data: mockUsers,
    });

    userService.updateUserStatus.mockResolvedValueOnce({
      success: true,
      message: 'Usuario desactivado',
    });

    renderWithAuth(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Usuario 1')).toBeInTheDocument();
    });

    const toggleButton = screen.getAllByRole('button', { name: /desactivar|activar|toggle/i })[0];
    await user.click(toggleButton);

    await waitFor(() => {
      expect(userService.updateUserStatus).toHaveBeenCalled();
    });
  });

  it('debe permitir editar un usuario', async () => {
    const user = userEvent.setup();
    const userService = vi.mocked(require('../../services/userService').userService);
    
    userService.getUsers.mockResolvedValueOnce({
      success: true,
      data: mockUsers,
    });

    renderWithAuth(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Usuario 1')).toBeInTheDocument();
    });

    const editButton = screen.getAllByRole('button', { name: /editar|edit/i })[0];
    await user.click(editButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('debe mostrar mensaje si no hay usuarios', async () => {
    const userService = vi.mocked(require('../../services/userService').userService);
    
    userService.getUsers.mockResolvedValueOnce({
      success: true,
      data: [],
    });

    renderWithAuth(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/no hay usuarios|vacío/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar error si falla la carga de usuarios', async () => {
    const userService = vi.mocked(require('../../services/userService').userService);
    
    userService.getUsers.mockRejectedValueOnce({
      success: false,
      message: 'Error al cargar usuarios',
    });

    renderWithAuth(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/error|fallo/i)).toBeInTheDocument();
    });
  });

  it('debe mostrar spinner de carga', () => {
    const userService = vi.mocked(require('../../services/userService').userService);
    
    userService.getUsers.mockImplementationOnce(() => 
      new Promise(() => {})
    );

    renderWithAuth(<AdminDashboard />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('debe tener un botón para crear nuevo usuario', () => {
    renderWithAuth(<AdminDashboard />);

    const createButton = screen.getByRole('button', { name: /crear|nuevo|add/i });
    expect(createButton).toBeInTheDocument();
  });

  it('debe navegar a crear usuario al hacer click', async () => {
    const user = userEvent.setup();
    renderWithAuth(<AdminDashboard />);

    const createButton = screen.getByRole('button', { name: /crear|nuevo|add/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
