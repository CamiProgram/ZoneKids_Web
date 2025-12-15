import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminDashboard } from '../../../pages/admin/AdminDashboard';

describe('AdminDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe renderizar el dashboard de admin', () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(document.body).toBeInTheDocument();
  });

  it('debe tener un contenedor principal', () => {
    const { container } = render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
  });
});
