import React from 'react';
import '../../styles/pages/returnsPage.css';

export const ReturnsPage = () => {
  const returnSteps = [
    {
      step: 1,
      title: 'Contacta con nosotros',
      description: 'Envía un correo dentro de 30 días de tu compra explicando el motivo de la devolución',
      icon: '💬',
    },
    {
      step: 2,
      title: 'Recibe autorización',
      description: 'Te enviaremos un número de autorización y las instrucciones de envío',
      icon: '✅',
    },
    {
      step: 3,
      title: 'Empaca el producto',
      description: 'Asegúrate de empacar bien el producto en su empaque original',
      icon: '📦',
    },
    {
      step: 4,
      title: 'Envía el paquete',
      description: 'Envía el paquete con el número de autorización. El envío es a nuestro costo',
      icon: '🚚',
    },
    {
      step: 5,
      title: 'Recibe tu reembolso',
      description: 'Una vez recibamos y verificamos, procesamos tu reembolso en 5-7 días',
      icon: '💰',
    },
  ];

  const returnReasons = [
    'Producto defectuoso o dañado',
    'Producto no corresponde con la descripción',
    'Talla o color incorrecto',
    'Cambio de opinión (dentro de 30 días)',
    'Producto no llego',
  ];

  return (
    <div className="returns-container">
      <div className="returns-content">
        {/* Header */}
        <section className="returns-header">
          <h1>Política de Devoluciones</h1>
          <p>En ZoneKids queremos que estés 100% satisfecho con tu compra</p>
        </section>

        {/* Policy Overview */}
        <section className="returns-overview">
          <div className="overview-card">
            <h3>30 Días</h3>
            <p>Plazo para devolver productos</p>
          </div>
          <div className="overview-card">
            <h3>Gratis</h3>
            <p>Costo de envío de devolución</p>
          </div>
          <div className="overview-card">
            <h3>Rápido</h3>
            <p>Proceso simple y sin complicaciones</p>
          </div>
          <div className="overview-card">
            <h3>100%</h3>
            <p>Garantía de reembolso</p>
          </div>
        </section>

        {/* Return Process */}
        <section className="returns-process">
          <h2>Proceso de Devolución</h2>
          <div className="process-timeline">
            {returnSteps.map((step, index) => (
              <div key={index} className="timeline-step">
                <div className="step-icon">{step.icon}</div>
                <div className="step-content">
                  <h3>Paso {step.step}: {step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Valid Reasons */}
        <section className="returns-reasons">
          <h2>Motivos Válidos para Devolver</h2>
          <div className="reasons-list">
            {returnReasons.map((reason, index) => (
              <div key={index} className="reason-item">
                <span className="reason-check">✓</span>
                <p>{reason}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Conditions */}
        <section className="returns-conditions">
          <h2>Condiciones para Aceptar Devoluciones</h2>
          <div className="conditions-grid">
            <div className="condition-card">
              <h3>🏷️ Producto Original</h3>
              <p>Debe incluir todas las etiquetas y estar en condiciones de reventa</p>
            </div>
            <div className="condition-card">
              <h3>📋 Comprobante</h3>
              <p>Debes proporcionar tu número de pedido y correo de compra</p>
            </div>
            <div className="condition-card">
              <h3>⏰ Plazo</h3>
              <p>Las devoluciones deben iniciarse dentro de 30 días de recibir el producto</p>
            </div>
            <div className="condition-card">
              <h3>📦 Empaque</h3>
              <p>El producto debe estar en su empaque original y sin uso</p>
            </div>
          </div>
        </section>

        {/* What's Not Returnable */}
        <section className="returns-restrictions">
          <h2>Lo que No se Puede Devolver</h2>
          <div className="restrictions-list">
            <div className="restriction-item">
              <span className="restriction-icon">✗</span>
              <div>
                <h4>Productos usados o dañados</h4>
                <p>Productos que muestren signos de uso o daño causado por el cliente</p>
              </div>
            </div>
            <div className="restriction-item">
              <span className="restriction-icon">✗</span>
              <div>
                <h4>Fuera del plazo</h4>
                <p>Devoluciones iniciadas después de 30 días de la compra</p>
              </div>
            </div>
            <div className="restriction-item">
              <span className="restriction-icon">✗</span>
              <div>
                <h4>Sin comprobante</h4>
                <p>Productos sin número de orden o comprobante de compra</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="returns-contact">
          <h2>¿Tienes preguntas?</h2>
          <p>Contáctanos para iniciar una devolución</p>
          <a href="/contacto" className="contact-link">Enviar mensaje</a>
        </section>
      </div>
    </div>
  );
};
