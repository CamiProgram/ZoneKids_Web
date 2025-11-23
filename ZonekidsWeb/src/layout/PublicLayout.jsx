import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartModal } from '../components/CartModal';
import '../styles/layout/publicLayout.css';

export const PublicLayout = () => {
  return (
    <div className="public-layout">
      <Navbar />
      <CartModal />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};