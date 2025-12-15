import React, { useState } from 'react';
import '../../styles/pages/contactPage.css';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envío (en producción iría a un backend)
    console.log('Mensaje enviado:', formData);
    setSubmitted(true);
    
    // Limpiar formulario
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="contact-page-container">
      <div className="contact-content">
        <div className="contact-header">
          <h1>Contáctanos</h1>
          <p>¿Tienes preguntas? ¡Nos encantaría escucharte!</p>
        </div>

        <div className="contact-main">
          {/* Formulario */}
          <div className="contact-form-section">
            <h2>Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Asunto</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Asunto de tu mensaje"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Cuéntanos más..."
                  rows="6"
                />
              </div>

              <button type="submit" className="submit-button">
                Enviar mensaje
              </button>
            </form>

            {/* Notificación de éxito */}
            {submitted && (
              <div className="success-notification">
                <div className="notification-content">
                  <span className="notification-icon">✓</span>
                  <div>
                    <h3>¡Mensaje enviado!</h3>
                    <p>Gracias por contactarnos. Nos pondremos en contacto contigo pronto.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Información de contacto y redes sociales */}
          <div className="contact-info-section">
            <h2>Síguenos</h2>
            <div className="social-media">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook" title="Facebook">
                👍
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram" title="Instagram">
                📷
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter" title="Twitter">
                🐦
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link tiktok" title="TikTok">
                🎵
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link youtube" title="YouTube">
                ▶️
              </a>
            </div>

            <div className="contact-info">
              <h3>Información de Contacto</h3>
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <p className="info-label">Email</p>
                  <p>info@zonekids.com</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📱</span>
                <div>
                  <p className="info-label">Teléfono</p>
                  <p>+57 (1) 2345-6789</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <p className="info-label">Ubicación</p>
                  <p>Bogotá, Colombia</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🕒</span>
                <div>
                  <p className="info-label">Horario de atención</p>
                  <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
