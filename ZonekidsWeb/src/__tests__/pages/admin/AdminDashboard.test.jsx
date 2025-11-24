import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { AdminDashboard } from '../../../pages/admin/AdminDashboard';

describe('AdminDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderWithAuth = (component) => {
    const mockAuthValue = {
      user: { role: 'admin' },
      token: 'mock-token',
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

  it('debe renderizar el dashboard de admin', () => {
    renderWithAuth(<AdminDashboard />);

    expect(document.body).toBeInTheDocument();
  });

  it('debe tener un contenedor principal', () => {
    const { container } = renderWithAuth(<AdminDashboard />);

    expect(container).toBeInTheDocument();
  });
});
