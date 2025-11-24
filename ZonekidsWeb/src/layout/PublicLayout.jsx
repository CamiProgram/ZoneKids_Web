import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CartModal } from '../components/CartModal';
import { AdminSetup } from '../components/AdminSetup';
import '../styles/layout/publicLayout.css';

export const PublicLayout = () => {
  return (
    <div className="public-layout">
      <Navbar />
      <CartModal />
      <AdminSetup />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};