import React from 'react';
import '../../styles/pages/shippingPage.css';

export const ShippingPage = () => {
  const shippingOptions = [
    {
      name: 'Envío Estándar',
      time: '5-7 días hábiles',
      cost: 'Gratis en compras mayores a $50',
      icon: '📦',
      description: 'Entrega segura a tu domicilio',
    },
    {
      name: 'Envío Expresado',
      time: '2-3 días hábiles',
      cost: '$9.99',
      icon: '⚡',
      description: 'Entrega más rápida con seguimiento',
    },
    {
      name: 'Envío Urgente',
      time: '1 día hábil',
      cost: '$19.99',
      icon: '🚀',
      description: 'Para compras urgentes',
    },
  ];

  const faqs = [
    {
      question: '¿A dónde envían?',
      answer: 'Actualmente entregamos en Santiago de Chile. Estamos trabajando para expandir nuestros servicios a otras ciudades.',
    },
    {
      question: '¿Puedo cambiar mi dirección de envío después de comprar?',
      answer: 'Sí, puedes cambiar tu dirección siempre que el paquete no haya sido procesado. Contacta a nuestro equipo lo antes posible.',
    },
    {
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Recibirás un correo con el número de seguimiento una vez que tu pedido sea enviado. Puedes usarlo para rastrearlo en tiempo real.',
    },
    {
      question: '¿Qué sucede si mi paquete se pierde?',
      answer: 'Si tu paquete no llega, contacta a nuestro equipo de atención al cliente. Estamos cubiertos por seguros y reemplazaremos tu pedido.',
    },
    {
      question: '¿Hacen envíos a otras ciudades?',
      answer: 'Por ahora solo entregamos en Santiago de Chile. Próximamente expandiremos nuestro área de cobertura.',
    },
  ];

  const [expandedFaq, setExpandedFaq] = React.useState(null);

  return (
    <div className="shipping-container">
      <div className="shipping-content">
        {/* Header */}
        <section className="shipping-header">
          <h1>Información de Envío</h1>
          <p>Entregamos tus compras de forma segura y confiable</p>
        </section>

        {/* Shipping options */}
        <section className="shipping-options">
          <h2>Opciones de Envío</h2>
          <div className="options-grid">
            {shippingOptions.map((option, index) => (
              <div key={index} className="option-card">
                <div className="option-icon">{option.icon}</div>
                <h3>{option.name}</h3>
                <div className="option-time">⏱️ {option.time}</div>
                <div className="option-cost">{option.cost}</div>
                <p className="option-description">{option.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping areas */}
        <section className="shipping-coverage">
          <h2>Cobertura de Envío</h2>
          <div className="coverage-content">
            <div className="coverage-text">
              <h3>Nuestra Zona de Cobertura</h3>
              <ul>
                <li>✓ Santiago de Chile</li>
                <li>ℹ️ Próximamente expanderemos a otras ciudades</li>
              </ul>
            </div>
            <div className="coverage-map">
              <div className="map-placeholder">🏠</div>
              <p>Santiago de Chile - Nuestro principal lugar de operación</p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="shipping-process">
          <h2>Proceso de Envío</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Confirmación</h3>
              <p>Recibirás un correo de confirmación inmediatamente después de tu compra</p>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Preparación</h3>
              <p>Preparamos tu pedido en nuestro almacén (1-2 días hábiles)</p>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Envío</h3>
              <p>Tu paquete sale hacia su destino con número de seguimiento</p>
            </div>
            <div className="process-arrow">→</div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Entrega</h3>
              <p>¡Tu paquete llega a tu domicilio! Confirma la entrega</p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="shipping-tips">
          <h2>Consejos para tu Envío</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">📍</div>
              <h3>Dirección Correcta</h3>
              <p>Verifica cuidadosamente tu dirección para evitar demoras en la entrega</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🔔</div>
              <h3>Sé Disponible</h3>
              <p>Asegúrate de estar disponible en la fecha de entrega estimada</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📸</div>
              <h3>Revisa tu Paquete</h3>
              <p>Abre el paquete inmediatamente y verifica que todo esté en orden</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">💬</div>
              <h3>Contacta Rápido</h3>
              <p>Si hay algún problema, contáctanos dentro de 24 horas de la entrega</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="shipping-faq">
          <h2>Preguntas Frecuentes</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{expandedFaq === index ? '▼' : '▶'}</span>
                </button>
                {expandedFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="shipping-contact">
          <h2>¿Tienes dudas?</h2>
          <p>Contáctanos y te ayudaremos</p>
          <a href="/contacto" className="contact-button">
            Enviar mensaje
          </a>
        </section>
      </div>
    </div>
  );
};
