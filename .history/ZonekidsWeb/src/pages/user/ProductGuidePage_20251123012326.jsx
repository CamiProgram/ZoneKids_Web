import React from 'react';
import '../../styles/pages/productGuidePage.css';

export const ProductGuidePage = () => {
  const categories = [
    {
      title: 'Ropa para Bebés (0-12 meses)',
      icon: '👶',
      tips: [
        'Elige tallas según el peso y la edad',
        'Opta por telas suaves y transpirables',
        'Evita prendas con cierres pequeños o botones',
        'Prefiere diseños seguros sin cordones',
      ],
    },
    {
      title: 'Ropa para Niños (1-5 años)',
      icon: '👦',
      tips: [
        'Busca prendas resistentes y durables',
        'Elige colores que combinen fácilmente',
        'Considera la facilidad para cambiar pañal',
        'Opta por prendas de fácil cuidado',
      ],
    },
    {
      title: 'Ropa para Niños Mayores (6-12 años)',
      icon: '👧',
      tips: [
        'Permite que el niño participe en la elección',
        'Busca diseños actuales y cómodos',
        'Considera deportes y actividades favoritas',
        'Elige tallas con margen para crecer',
      ],
    },
    {
      title: 'Accesorios',
      icon: '🎽',
      tips: [
        'Asegúrate de que sean seguros',
        'Evita piezas pequeñas destacables',
        'Elige accesorios que combinen',
        'Prefiere materiales de calidad',
      ],
    },
  ];

  const sizingTips = [
    {
      title: 'Medir Correctamente',
      description: 'Usa una cinta métrica flexible. Mide alrededor del pecho, cintura y largo de la prenda.',
      icon: '📏',
    },
    {
      title: 'Dejar Espacio',
      description: 'Permite 2-3 cm extra para comodidad y movimiento. Los niños crecen rápidamente.',
      icon: '🎁',
    },
    {
      title: 'Considerar la Tela',
      description: 'Las telas elásticas pueden ser más cómodas. Verifica el porcentaje de elastán.',
      icon: '✨',
    },
    {
      title: 'Probar Antes',
      description: 'Si es posible, prueba la prenda. Si no, revisa la política de cambios.',
      icon: '👕',
    },
  ];

  const careTips = [
    {
      title: 'Lavar a Mano',
      description: 'Para prendas delicadas, lava con agua tibia y jabón suave.',
      icon: '🧼',
    },
    {
      title: 'Temperatura Correcta',
      description: 'Usa agua fría o tibia. El agua caliente puede dañar la tela.',
      icon: '🌡️',
    },
    {
      title: 'Secado',
      description: 'Prefiere secar al aire. Evita secar en secadora de ropa.',
      icon: '☀️',
    },
    {
      title: 'Almacenamiento',
      description: 'Guarda en lugar seco y ventilado. Evita humedad.',
      icon: '📦',
    },
  ];

  return (
    <div className="guide-container">
      <div className="guide-content">
        {/* Header */}
        <section className="guide-header">
          <h1>Guía de Productos</h1>
          <p>Consejos para elegir y cuidar la ropa de tus hijos</p>
        </section>

        {/* Categories */}
        <section className="guide-categories">
          <h2>Categorías de Ropa</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.title}</h3>
                <ul className="tips-list">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>
                      <span className="tip-check">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Sizing */
        <section className="guide-sizing">
          <h2>Cómo Elegir la Talla Correcta</h2>
          <div className="sizing-grid">
            {sizingTips.map((tip, index) => (
              <div key={index} className="sizing-card">
                <div className="sizing-icon">{tip.icon}</div>
                <h3>{tip.title}</h3>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Size Chart */}
        <section className="guide-chart">
          <h2>Tabla de Tallas</h2>
          <div className="chart-container">
            <table className="size-table">
              <thead>
                <tr>
                  <th>Edad</th>
                  <th>Peso (kg)</th>
                  <th>Talla Recomendada</th>
                  <th>Medidas (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0-3 meses</td>
                  <td>3-6 kg</td>
                  <td>Newborn (NB)</td>
                  <td>50-56</td>
                </tr>
                <tr>
                  <td>3-6 meses</td>
                  <td>6-8 kg</td>
                  <td>3-6M</td>
                  <td>62</td>
                </tr>
                <tr>
                  <td>6-12 meses</td>
                  <td>8-11 kg</td>
                  <td>6-12M</td>
                  <td>68-74</td>
                </tr>
                <tr>
                  <td>1-2 años</td>
                  <td>11-14 kg</td>
                  <td>18-24M</td>
                  <td>80-86</td>
                </tr>
                <tr>
                  <td>2-3 años</td>
                  <td>14-16 kg</td>
                  <td>2-3T</td>
                  <td>92-98</td>
                </tr>
                <tr>
                  <td>3-4 años</td>
                  <td>16-18 kg</td>
                  <td>3-4T</td>
                  <td>104</td>
                </tr>
                <tr>
                  <td>5-6 años</td>
                  <td>18-20 kg</td>
                  <td>5-6T</td>
                  <td>110</td>
                </tr>
                <tr>
                  <td>7-8 años</td>
                  <td>20-25 kg</td>
                  <td>7-8T</td>
                  <td>122-128</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Care */}
        <section className="guide-care">
          <h2>Cuidado de Prendas</h2>
          <div className="care-grid">
            {careTips.map((tip, index) => (
              <div key={index} className="care-card">
                <div className="care-icon">{tip.icon}</div>
                <h3>{tip.title}</h3>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sustainability */}
        <section className="guide-sustainability">
          <h2>Sostenibilidad</h2>
          <div className="sustainability-content">
            <div className="sustainability-text">
              <p>
                En ZoneKids nos preocupamos por el planeta. Nuestros productos están hecho con:
              </p>
              <ul>
                <li>✓ Telas de algodón orgánico certificado</li>
                <li>✓ Procesos de fabricación sostenibles</li>
                <li>✓ Proveedores comprometidos con el medio ambiente</li>
                <li>✓ Empaques reciclables y biodegradables</li>
              </ul>
            </div>
            <div className="sustainability-icon">🌱</div>
          </div>
        </section>

        {/* FAQ */}
        <section className="guide-faq">
          <h2>Preguntas Frecuentes</h2>
          <div className="faq-container">
            <div className="faq-item">
              <h3>¿Cómo sé cuál es la talla correcta?</h3>
              <p>Usa nuestra tabla de tallas como referencia. Si tu hijo está entre dos tallas, elige la más grande para que tenga espacio para crecer.</p>
            </div>
            <div className="faq-item">
              <h3>¿Cuál es la mejor tela para piel sensible?</h3>
              <p>El algodón 100% es la mejor opción. Busca prendas sin tratamientos químicos. Nuestras colecciones orgánicas son ideales.</p>
            </div>
            <div className="faq-item">
              <h3>¿Puedo cambiar la prenda si la talla no es correcta?</h3>
              <p>Sí, tienes 30 días para cambiar la talla. Solo asegúrate de que la prenda esté sin usar y con etiquetas.</p>
            </div>
            <div className="faq-item">
              <h3>¿Cómo puedo hacer que la ropa dure más?</h3>
              <p>Lava con agua fría, seca al aire libre, y guarda correctamente. Evita el cloro en ropa de color.</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="guide-contact">
          <h2>¿Necesitas más información?</h2>
          <p>Contáctanos y te ayudaremos a elegir el producto perfecto para tu hijo</p>
          <a href="/contacto" className="guide-button">
            Enviar mensaje
          </a>
        </section>
      </div>
    </div>
  );
};
