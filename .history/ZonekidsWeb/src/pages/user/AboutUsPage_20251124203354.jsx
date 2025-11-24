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
              <p>Seleccionamos cuidadosamente cada prenda para garantizar calidad y durabilidad.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Confianza</h3>
              <p>Somos transparentes en nuestros precios, políticas y relación con nuestros clientes.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>Innovación</h3>
              <p>Constantemente buscamos nuevas formas de mejorar tu experiencia de compra.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💚</div>
              <h3>Responsabilidad Social</h3>
              <p>Trabajamos con proveedores éticos y contribuimos al bienestar de nuestras comunidades.</p>
            </div>
          </div>
        </section>

        {/* Números */}
        <section className="about-stats">
          <div className="stat-card">
            <h3>50K+</h3>
            <p>Clientes felices</p>
          </div>
          <div className="stat-card">
            <h3>5000+</h3>
            <p>Productos disponibles</p>
          </div>
          <div className="stat-card">
            <h3>15</h3>
            <p>Países de envío</p>
          </div>
          <div className="stat-card">
            <h3>98%</h3>
            <p>Satisfacción del cliente</p>
          </div>
        </section>

        {/* Equipo */}
        <section className="about-team">
          <h2>Nuestro Equipo</h2>
          <p className="team-intro">
            Un equipo apasionado por la moda infantil que trabaja día a día para brindarte la mejor experiencia.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h3>Juan Rodríguez</h3>
              <p>Fundador y CEO</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍💼</div>
              <h3>María García</h3>
              <p>Directora de Diseño</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍💻</div>
              <h3>Carlos López</h3>
              <p>Director Técnico</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍🤝‍👨</div>
              <h3>Equipo de Atención</h3>
              <p>Servicio al Cliente</p>
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
