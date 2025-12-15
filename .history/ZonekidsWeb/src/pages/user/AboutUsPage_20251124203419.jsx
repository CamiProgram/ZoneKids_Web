import React from 'react';
import '../../styles/pages/aboutUsPage.css';

export const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      <div className="about-content">
        {/* Sección de introducción */}
        <section className="about-intro">
          <h1>Quiénes Somos</h1>
          <p>ZoneKids es un micro emprendimiento dedicado a satisfacer a las mamás con moda, accesorios y juguetes de calidad para bebés mayores a 6 meses.</p>
        </section>

        {/* Sección principal */}
        <section className="about-main">
          <div className="about-text">
            <h2>Nuestra Historia</h2>
            <p>
              ZoneKids comenzó en enero de 2024 con una misión clara: ofrecer productos de calidad para bebés mayores a 6 meses que satisfagan las necesidades de las mamás. Desde nuestro inicio, nos hemos enfocado en proporcionar ropa, zapatos, zapatillas y juguetes seleccionados cuidadosamente.
            </p>
            <p>
              Creemos que cada bebé merece lo mejor, y por eso trabajamos con eficiencia y dedicación para que nuestros clientes reciban productos excepcionales que superen sus expectativas. La satisfacción de nuestras mamás es nuestra prioridad.
            </p>
          </div>
          <div className="about-image">
            <div className="placeholder-image">🎨</div>
          </div>
        </section>

        {/* Valores */}
        <section className="about-values">
          <h2>Nuestros Valores</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3>Calidad</h3>
              <p>Seleccionamos cuidadosamente cada producto para garantizar calidad y seguridad para los bebés.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Satisfacción del Cliente</h3>
              <p>Nos enfocamos en superar las expectativas de nuestras mamás en cada compra.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Eficiencia</h3>
              <p>Operamos con procesos ágiles para entregar rápidamente lo que nuestros clientes necesitan.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">👶</div>
              <h3>Dedicación a Bebés</h3>
              <p>Todos nuestros productos están pensados especialmente para bebés mayores a 6 meses.</p>
            </div>
          </div>
        </section>

        {/* Números */}
        <section className="about-stats">
          <div className="stat-card">
            <h3>100%</h3>
            <p>Dedicación</p>
          </div>
          <div className="stat-card">
            <h3>2024</h3>
            <p>Fundado en Enero</p>
          </div>
          <div className="stat-card">
            <h3>6m+</h3>
            <p>Para bebés mayores</p>
          </div>
          <div className="stat-card">
            <h3>😊</h3>
            <p>Mamás satisfechas</p>
          </div>
        </section>

        {/* Equipo */}
        <section className="about-team">
          <h2>Nuestro Equipo</h2>
          <p className="team-intro">
            Un pequeño equipo apasionado que trabaja día a día para satisfacer a las mamás con los mejores productos.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👩‍💼</div>
              <h3>Dana Eo Collao</h3>
              <p>Dueña</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3>Camilo Tapia</h3>
              <p>Diseñador y Programador</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">🎯</div>
              <h3>Enfoque</h3>
              <p>Eficiencia y Satisfacción</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">❤️</div>
              <h3>Pasión</h3>
              <p>Por lo que hacemos</p>
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="about-mission">
          <div className="mission-card">
            <h3>Misión</h3>
            <p>
              Proporcionar ropa infantil de calidad, estilo y confort a precios accesibles, facilitando la compra online para familias de toda Latinoamérica.
            </p>
          </div>
          <div className="vision-card">
            <h3>Visión</h3>
            <p>
              Ser la plataforma de moda infantil más confiable y preferida en Latinoamérica, reconocida por nuestra calidad, servicio y compromiso con las familias.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
