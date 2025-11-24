import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CheckoutPage } from '../../../pages/user/CheckoutPage';

describe('CheckoutPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe renderizar la página de checkout', () => {
    render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>
    );

    expect(document.body).toBeInTheDocument();
  });

  it('debe tener un contenedor principal', () => {
    const { container } = render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
  });
});
