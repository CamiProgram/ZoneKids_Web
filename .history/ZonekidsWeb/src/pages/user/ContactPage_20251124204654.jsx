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
  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (name, value) => {
    const errors = { ...fieldErrors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'El nombre es requerido';
        } else if (value.trim().length < 3) {
          errors.name = 'El nombre debe tener al menos 3 caracteres';
        } else {
          delete errors.name;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = 'El email es requerido';
        } else if (!emailRegex.test(value)) {
          errors.email = 'El email no es válido';
        } else {
          delete errors.email;
        }
        break;

      case 'subject':
        if (!value.trim()) {
          errors.subject = 'El asunto es requerido';
        } else if (value.trim().length < 3) {
          errors.subject = 'El asunto debe tener al menos 3 caracteres';
        } else {
          delete errors.subject;
        }
        break;

      case 'message':
        if (!value.trim()) {
          errors.message = 'El mensaje es requerido';
        } else if (value.trim().length < 10) {
          errors.message = 'El mensaje debe tener al menos 10 caracteres';
        } else {
          delete errors.message;
        }
        break;

      default:
        break;
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    const newErrors = validateField(name, value);
    setFieldErrors(newErrors);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = validateField(name, value);
    setFieldErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    let errors = {};
    errors = validateField('name', formData.name);
    errors = { ...errors, ...validateField('email', formData.email) };
    errors = { ...errors, ...validateField('subject', formData.subject) };
    errors = { ...errors, ...validateField('message', formData.message) };

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

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
    setFieldErrors({});

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
                  onBlur={handleBlur}
                  required
                  placeholder="Tu nombre completo"
                  className={fieldErrors.name ? 'input-error' : ''}
                />
                {fieldErrors.name && <span className="error-message">{fieldErrors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="tu@email.com"
                  className={fieldErrors.email ? 'input-error' : ''}
                />
                {fieldErrors.email && <span className="error-message">{fieldErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="subject">Asunto</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Asunto de tu mensaje"
                  className={fieldErrors.subject ? 'input-error' : ''}
                />
                {fieldErrors.subject && <span className="error-message">{fieldErrors.subject}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Cuéntanos más..."
                  rows="6"
                  className={fieldErrors.message ? 'input-error' : ''}
                />
                {fieldErrors.message && <span className="error-message">{fieldErrors.message}</span>}
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
              <a href="https://www.instagram.com/zonekids.cl" target="_blank" rel="noopener noreferrer" className="social-link instagram" title="Instagram">
                📷
              </a>
            </div>

            <div className="contact-info">
              <h3>Información de Contacto</h3>
              <div className="info-item">
                <span className="info-icon">📧</span>
                <div>
                  <p className="info-label">Email</p>
                  <p>zonekids@contacto.com</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">👩‍💼</span>
                <div>
                  <p className="info-label">Dueña</p>
                  <p>Dana Eo Collao</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">👨‍💻</span>
                <div>
                  <p className="info-label">Diseñador y Programador</p>
                  <p>Camilo Tapia</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🎯</span>
                <div>
                  <p className="info-label">Nuestro Enfoque</p>
                  <p>Eficiencia y Satisfacción del Cliente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
