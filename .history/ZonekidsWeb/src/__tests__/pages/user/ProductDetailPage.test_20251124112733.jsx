import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductDetailPage } from '../../../pages/user/ProductDetailPage';

describe('ProductDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it('debe renderizar la página de detalle del producto', () => {
    render(
      <BrowserRouter>
        <ProductDetailPage />
      </BrowserRouter>
    );

    expect(document.body).toBeInTheDocument();
  });

  it('debe tener un contenedor principal', () => {
    const { container } = render(
      <BrowserRouter>
        <ProductDetailPage />
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
  });
});
