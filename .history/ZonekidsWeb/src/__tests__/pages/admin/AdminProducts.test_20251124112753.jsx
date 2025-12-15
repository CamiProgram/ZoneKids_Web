import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminProducts } from '../../../pages/admin/AdminProducts';

describe('AdminProducts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe renderizar la página de administración de productos', () => {
    render(
      <BrowserRouter>
        <AdminProducts />
      </BrowserRouter>
    );

    expect(document.body).toBeInTheDocument();
  });

  it('debe tener un contenedor principal', () => {
    const { container } = render(
      <BrowserRouter>
        <AdminProducts />
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
  });
});
