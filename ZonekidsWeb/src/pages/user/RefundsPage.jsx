import React from 'react';
import '../../styles/pages/refundsPage.css';

export const RefundsPage = () => {
  const refundTimeline = [
    {
      title: 'Devolución Iniciada',
      description: 'Contactas con nosotros y recibimos tu solicitud de devolución',
      time: 'Día 1',
      icon: '📧',
    },
    {
      title: 'Autorización',
      description: 'Te enviamos número de autorización e instrucciones',
      time: 'Día 1-2',
      icon: '✅',
    },
    {
      title: 'Envío del Producto',
      description: 'Envías el producto a nuestras instalaciones',
      time: 'Día 3-10',
      icon: '🚚',
    },
    {
      title: 'Recepción y Inspección',
      description: 'Verificamos el estado del producto',
      time: 'Día 10-12',
      icon: '🔍',
    },
    {
      title: 'Reembolso Procesado',
      description: 'Se procesa el reembolso a tu método de pago',
      time: 'Día 13-15',
      icon: '💳',
    },
    {
      title: 'Reembolso Recibido',
      description: 'El dinero llega a tu cuenta (puede variar según tu banco)',
      time: 'Día 15-20',
      icon: '🎉',
    },
  ];

  const refundMethods = [
    {
      method: 'Tarjeta de Crédito/Débito',
      time: '3-5 días hábiles',
      description: 'El reembolso aparecerá en tu próximo estado de cuenta',
      icon: '💳',
    },
    {
      method: 'Mercado Pago',
      time: '1-3 días hábiles',
      description: 'Se acreditará directamente en tu billetera',
      icon: '📱',
    },
    {
      method: 'Transferencia Bancaria',
      time: '2-5 días hábiles',
      description: 'Depósito directo en tu cuenta bancaria',
      icon: '🏦',
    },
    {
      method: 'Crédito de Tienda',
      time: 'Inmediato',
      description: 'Recibe un cupón para usar en futuras compras',
      icon: '🎁',
    },
  ];

  const faqs = [
    {
      question: '¿Cuánto tiempo tarda en procesarse el reembolso?',
      answer: 'El tiempo varía según el método de pago: tarjetas 3-5 días, Mercado Pago 1-3 días, transferencia 2-5 días. Los tiempos pueden variar según tu banco.',
    },
    {
      question: '¿Dónde veo el estado de mi reembolso?',
      answer: 'Recibirás actualizaciones por correo. También puedes contactarnos con tu número de orden para verificar el estado.',
    },
    {
      question: '¿Qué pasa si no recibo mi reembolso?',
      answer: 'Si no lo recibes en el tiempo indicado, contacta a tu banco o a nuestro equipo de atención. Investigaremos el problema.',
    },
    {
      question: '¿Puede ser parcial el reembolso?',
      answer: 'No, reembolsamos el 100% del precio del producto. Si hay gastos de envío, estos no se reembolsan.',
    },
    {
      question: '¿Puedo cambiar el método de reembolso?',
      answer: 'Sí, siempre que lo indiques antes de que procesemos el reembolso. Contacta rápidamente con nosotros.',
    },
    {
      question: '¿Hay retenciones fiscales?',
      answer: 'En algunos casos, según la legislación local, puede haber retenciones. Verificaremos esto al procesar tu reembolso.',
    },
  ];

  const [expandedFaq, setExpandedFaq] = React.useState(null);

  return (
    <div className="refunds-container">
      <div className="refunds-content">
        {/* Header */}
        <section className="refunds-header">
          <h1>Política de Reembolsos</h1>
          <p>Reembolsos rápidos, seguros y sin complicaciones</p>
        </section>

        {/* Refund Timeline */}
        <section className="refunds-timeline">
          <h2>Tiempo de Reembolso</h2>
          <div className="timeline">
            {refundTimeline.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-icon">{item.icon}</div>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="timeline-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Refund Methods */}
        <section className="refunds-methods">
          <h2>Métodos de Reembolso</h2>
          <div className="methods-grid">
            {refundMethods.map((method, index) => (
              <div key={index} className="method-card">
                <div className="method-icon">{method.icon}</div>
                <h3>{method.method}</h3>
                <div className="method-time">⏱️ {method.time}</div>
                <p>{method.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Important Info */}
        <section className="refunds-info">
          <h2>Información Importante</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>100% de Garantía</h3>
              <p>Si el producto no llega o tiene problemas, te devolvemos el 100% sin preguntas</p>
            </div>
            <div className="info-card">
              <h3>Envío Gratis</h3>
              <p>Los costos de envío de devolución corren por nuestra cuenta</p>
            </div>
            <div className="info-card">
              <h3>Sin Preguntas</h3>
              <p>Procesamos reembolsos sin necesidad de razones complicadas</p>
            </div>
            <div className="info-card">
              <h3>Seguro</h3>
              <p>Todos los reembolsos se procesan de forma segura y verificada</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="refunds-faq">
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
        <section className="refunds-contact">
          <h2>¿Necesitas ayuda?</h2>
          <p>Nuestro equipo está disponible para resolver tus dudas</p>
          <a href="/contacto" className="help-button">
            Contactar
          </a>
        </section>
      </div>
    </div>
  );
};
