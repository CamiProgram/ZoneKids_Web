import React from 'react';
import '../../styles/pages/pointsPage.css';

export const PointsPage = () => {
  const benefits = [
    {
      title: 'Por Cada Compra',
      description: 'Gana 1 punto por cada $1 USD gastado',
      icon: '💳',
    },
    {
      title: 'Acumula Puntos',
      description: 'Tus puntos se acumulan indefinidamente en tu cuenta',
      icon: '📊',
    },
    {
      title: 'Canjea Recompensas',
      description: 'Convierte tus puntos en descuentos y ofertas',
      icon: '🎁',
    },
    {
      title: 'Acceso VIP',
      description: 'Unlock exclusive deals and early access to new collections',
      icon: '👑',
    },
  ];

  const rewardTiers = [
    {
      tier: 'Bronce',
      points: '0-500',
      benefits: [
        'Descuento del 5% con 100 puntos',
        'Envío gratis con 150 puntos',
        'Birthday gift con 250 puntos',
      ],
      icon: '🥉',
      color: '#CD7F32',
    },
    {
      tier: 'Plata',
      points: '501-1000',
      benefits: [
        'Descuento del 10% con 150 puntos',
        'Envío express gratis',
        'Early access a nuevas colecciones',
        'Birthday gift especial',
      ],
      icon: '🥈',
      color: '#C0C0C0',
    },
    {
      tier: 'Oro',
      points: '1001+',
      benefits: [
        'Descuento del 15% con 200 puntos',
        'Envío gratis en todas las compras',
        'Early access a ventas',
        'Birthday gift premium',
        'Asistente personal VIP',
      ],
      icon: '🥇',
      color: '#FFD700',
    },
  ];

  const faqs = [
    {
      question: '¿Cómo obtengo puntos?',
      answer: 'Ganas 1 punto por cada $1 USD que gastes. Los puntos se acreditan automáticamente después de la compra.',
    },
    {
      question: '¿Cuándo caducan mis puntos?',
      answer: 'Tus puntos no caducan. Se mantienen en tu cuenta indefinidamente hasta que decidas canjearlos.',
    },
    {
      question: '¿Puedo canjear puntos en cualquier momento?',
      answer: 'Sí, puedes canjear tus puntos en cualquier momento. Accede a tu cuenta y selecciona la recompensa que deseas.',
    },
    {
      question: '¿Qué pasa con mis puntos si cancelo una compra?',
      answer: 'Si cancelas una compra, los puntos correspondientes se restarán de tu cuenta. Si ya los canjeaste, se reembolsarán.',
    },
    {
      question: '¿Puedo transferir mis puntos?',
      answer: 'Los puntos son personales y no pueden transferirse a otro usuario. Son intransferibles.',
    },
    {
      question: '¿Hay un máximo de puntos que pueda acumular?',
      answer: 'No hay límite máximo de puntos. Puedes acumular tantos como desees a lo largo de tu experiencia con ZoneKids.',
    },
  ];

  const [expandedFaq, setExpandedFaq] = React.useState(null);

  return (
    <div className="points-container">
      <div className="points-content">
        {/* Header */}
        <section className="points-header">
          <h1>Programa de Puntos ZoneKids</h1>
          <p>Gana puntos con cada compra y disfruta de recompensas exclusivas</p>
        </section>

        {/* Benefits Overview */}
        <section className="points-benefits">
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="points-how">
          <h2>Cómo Funciona</h2>
          <div className="how-steps">
            <div className="how-step">
              <div className="step-number">1</div>
              <h3>Compra</h3>
              <p>Realiza compras en ZoneKids y automáticamente ganas puntos</p>
            </div>
            <div className="how-arrow">→</div>
            <div className="how-step">
              <div className="step-number">2</div>
              <h3>Acumula</h3>
              <p>Tus puntos se acumulan en tu cuenta disponible</p>
            </div>
            <div className="how-arrow">→</div>
            <div className="how-step">
              <div className="step-number">3</div>
              <h3>Canjea</h3>
              <p>Convierte tus puntos en descuentos y recompensas</p>
            </div>
            <div className="how-arrow">→</div>
            <div className="how-step">
              <div className="step-number">4</div>
              <h3>Disfruta</h3>
              <p>Aprovecha tus recompensas en futuras compras</p>
            </div>
          </div>
        </section>

        {/* Reward Tiers */}
        <section className="points-tiers">
          <h2>Niveles de Recompensa</h2>
          <div className="tiers-grid">
            {rewardTiers.map((tier, index) => (
              <div key={index} className="tier-card" style={{ borderTopColor: tier.color }}>
                <div className="tier-icon">{tier.icon}</div>
                <h3>{tier.tier}</h3>
                <div className="tier-points">Puntos: {tier.points}</div>
                <ul className="tier-benefits">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex}>
                      <span className="benefit-check">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Rewards Available */}
        <section className="points-rewards">
          <h2>Recompensas Disponibles</h2>
          <div className="rewards-list">
            <div className="reward-item">
              <div className="reward-points">100 pts</div>
              <div className="reward-info">
                <h4>Descuento 5%</h4>
                <p>En tu próxima compra</p>
              </div>
            </div>
            <div className="reward-item">
              <div className="reward-points">150 pts</div>
              <div className="reward-info">
                <h4>Envío Gratis</h4>
                <p>En cualquier orden</p>
              </div>
            </div>
            <div className="reward-item">
              <div className="reward-points">200 pts</div>
              <div className="reward-info">
                <h4>Descuento 10%</h4>
                <p>En tu próxima compra</p>
              </div>
            </div>
            <div className="reward-item">
              <div className="reward-points">300 pts</div>
              <div className="reward-info">
                <h4>Descuento 15%</h4>
                <p>En tu próxima compra</p>
              </div>
            </div>
            <div className="reward-item">
              <div className="reward-points">250 pts</div>
              <div className="reward-info">
                <h4>Regalo Especial</h4>
                <p>Sorpresa exclusiva</p>
              </div>
            </div>
            <div className="reward-item">
              <div className="reward-points">400 pts</div>
              <div className="reward-info">
                <h4>Gift Card $20</h4>
                <p>Para usar en la tienda</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="points-tips">
          <h2>Consejos para Maximizar Puntos</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>💡 Compra en Promoción</h3>
              <p>Gana puntos en ofertas especiales y aprovecha el doble descuento</p>
            </div>
            <div className="tip-card">
              <h3>🎂 Celebra tu Cumpleaños</h3>
              <p>Recibe un regalo especial y puntos bonus durante tu mes</p>
            </div>
            <div className="tip-card">
              <h3>👥 Refiere Amigos</h3>
              <p>Gana puntos cuando tus amigos realizan compras con tu código</p>
            </div>
            <div className="tip-card">
              <h3>📧 Suscríbete al Newsletter</h3>
              <p>Recibe ofertas exclusivas y gana puntos extra</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="points-faq">
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
        <section className="points-contact">
          <h2>¿Tienes preguntas sobre tu cuenta?</h2>
          <p>Contáctanos para más información sobre tu programa de puntos</p>
          <a href="/contacto" className="contact-btn">
            Enviar mensaje
          </a>
        </section>
      </div>
    </div>
  );
};
