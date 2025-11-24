import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/footer.css';

export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>SOBRE NOSOTROS</h3>
          <ul>
            <li><a href="#">Quiénes somos</a></li>
            <li><Link to="/blogs">Blogs</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>AYUDA & APOYO</h3>
          <ul>
            <li><a href="#">Información de envío</a></li>
            <li><a href="#">Devolución</a></li>
            <li><a href="#">Reembolsos</a></li>
            <li><a href="#">Guía de productos</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>SERVICIO AL CLIENTE</h3>
          <ul>
            <li><a href="#">Contáctenos</a></li>
            <li><a href="#">Puntos</a></li>
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