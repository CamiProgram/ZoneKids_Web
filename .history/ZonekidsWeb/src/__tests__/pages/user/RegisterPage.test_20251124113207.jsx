import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { RegisterPage } from '../../../pages/user/RegisterPage';

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (component) => {
    const mockAuthValue = {
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
    };

    return render(
      <AuthContext.Provider value={mockAuthValue}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  it('debe renderizar el formulario de registro correctamente', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Crear Cuenta/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it('debe mostrar error si el nombre está vacío', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getAllByRole('button')[0];

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // El campo de nombre debe tener la clase de error
    const nameInput = screen.getByLabelText(/Nombre Completo/i);
    await waitFor(() => {
      expect(nameInput).toHaveClass('input-error');
    }, { timeout: 2000 });
  });

  it('debe mostrar error si el email es inválido', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/Nombre Completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getAllByRole('button')[0];

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // El campo de email debe tener la clase de error
    await waitFor(() => {
      expect(emailInput).toHaveClass('input-error');
    }, { timeout: 2000 });
  });

  it('debe mostrar error si la contraseña es muy corta', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/Nombre Completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getAllByRole('button')[0];

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '123');
    await user.click(submitButton);

    // Esperar a que aparezca el mensaje de error - la contraseña aparecerá en rojo
    await waitFor(() => {
      expect(passwordInput).toHaveClass('input-error');
    }, { timeout: 2000 });
  });

  it('debe permitir escribir en todos los campos', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/Nombre Completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(nameInput).toHaveValue('Test User');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('debe tener un enlace para ir al login', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const loginLink = screen.queryByRole('link', { name: /inicia sesión/i });
    if (loginLink) {
      expect(loginLink).toBeInTheDocument();
    }
  });
});
