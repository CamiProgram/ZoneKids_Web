import React from 'react';
import '../../styles/pages/aboutUsPage.css';

export const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      <div className="about-content">
        {/* Sección de introducción */}
        <section className="about-intro">
          <h1>Quiénes Somos</h1>
          <p>ZoneKids es la plataforma número uno en Latinoamérica para ropa y accesorios infantiles con estilo.</p>
        </section>

        {/* Sección principal */}
        <section className="about-main">
          <div className="about-text">
            <h2>Nuestra Historia</h2>
            <p>
              Fundada en 2020, ZoneKids nació con una visión clara: acercar moda infantil de calidad a padres que desean lo mejor para sus hijos. Comenzamos como una pequeña boutique y hemos crecido hasta convertirnos en la tienda online preferida de miles de familias.
            </p>
            <p>
              Creemos que la infancia es una etapa especial donde la moda debe ser divertida, cómoda y asequible. Por eso, trabajamos constantemente para traer las últimas tendencias de moda infantil directamente a tu hogar.
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
