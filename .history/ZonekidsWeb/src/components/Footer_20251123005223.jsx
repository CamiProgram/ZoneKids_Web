import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/footer.css';

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>SOBRE NOSOTROS</h3>
          <ul>
            <li><NavLink to="/sobre-nosotros">Quiénes somos</NavLink></li>
            <li><a href="#blogs">Blogs</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>AYUDA & APOYO</h3>
          <ul>
            <li><NavLink to="/envios">Información de envío</NavLink></li>
            <li><a href="#devolucion">Devolución</a></li>
            <li><a href="#reembolsos">Reembolsos</a></li>
            <li><a href="#guia">Guía de productos</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>SERVICIO AL CLIENTE</h3>
          <ul>
            <li><NavLink to="/contacto">Contáctenos</NavLink></li>
            <li><a href="#puntos">Puntos</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>ACEPTAMOS</h3>
          <div className="payment-methods">
            <img src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo.png" 
                alt="Visa" className="payment-icon" />
            <img src="https://logos-world.net/wp-content/uploads/2020/09/Mastercard-Logo.png" 
                alt="Mastercard" className="payment-icon" />
            <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png" 
                alt="Mercado Pago" className="payment-icon" />
            <img src="https://www.transbank.cl/wp-content/uploads/2020/11/webpay-plus_fb.png" 
                alt="WebPay" className="payment-icon" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Meli.svg/800px-Meli.svg.png" 
                alt="MercadoLibre" className="payment-icon" />
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <p>&copy; 2025 ZoneKids. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};