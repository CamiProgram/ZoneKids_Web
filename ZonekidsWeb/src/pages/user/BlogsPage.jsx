import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/blogsPage.css';

export const BlogsPage = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();

  const blogs = [
    {
      id: 1,
      title: '10 Tips para Elegir los Mejores Juguetes para tu Hijo',
      excerpt: 'Descubre cómo seleccionar juguetes que promuevan el aprendizaje y desarrollo de tu hijo...',
      content: 'Los juguetes son más que simple entretenimiento. Son herramientas fundamentales en el desarrollo infantil. En este artículo compartimos 10 consejos prácticos para elegir juguetes que estimulen la creatividad, imaginación y habilidades cognitivas de tu hijo. Consideramos la edad, seguridad, calidad y valor educativo. Aprende a identificar qué características hacen que un juguete sea realmente valioso para el desarrollo infantil.',
      author: 'Equipo ZoneKids',
      date: '2025-11-15',
      image: 'https://via.placeholder.com/400x300?text=Choosing+Toys',
      category: 'Desarrollo Infantil'
    },
    {
      id: 2,
      title: 'Seguridad en Juguetes: Lo que Debes Saber',
      excerpt: 'Información importante sobre normas de seguridad y certificaciones de juguetes...',
      content: 'La seguridad de tus hijos es lo más importante. En este blog exploramos las normas internacionales de seguridad de juguetes, cómo identificar productos certificados, y qué revisar antes de comprar. Hablamos de normas ISO, estándares europeos y americanos, y cómo verificar que un producto haya pasado los controles de calidad necesarios para garantizar que es seguro para tu familia.',
      author: 'Dr. Juan Rodríguez',
      date: '2025-11-10',
      image: 'https://via.placeholder.com/400x300?text=Safety',
      category: 'Seguridad'
    },
    {
      id: 3,
      title: 'Juguetes Educativos: Aprender Jugando',
      excerpt: 'Cómo los juguetes educativos pueden potenciar el aprendizaje de forma divertida...',
      content: 'El aprendizaje no tiene por qué ser aburrido. Los juguetes educativos combinan diversión y educación de manera efectiva. Exploraremos diferentes tipos de juguetes que desarrollan habilidades matemáticas, lingüísticas, artísticas y científicas. Desde construcción hasta puzzles, juegos de lógica y robots programables, descubre cómo motivar a tu hijo a aprender nuevas habilidades mientras se divierte.',
      author: 'Maestra Laura Méndez',
      date: '2025-11-05',
      image: 'https://via.placeholder.com/400x300?text=Educational',
      category: 'Educación'
    },
    {
      id: 4,
      title: 'El Desarrollo Motriz a Través del Juego',
      excerpt: 'Cómo el juego activo contribuye al desarrollo de la motricidad infantil...',
      content: 'El movimiento es fundamental en el desarrollo infantil. El juego activo no solo es divertido, sino que es esencial para el desarrollo de la motricidad fina y gruesa. En este artículo descubrirás qué tipos de actividades y juguetes estimulan diferentes habilidades motrices según la edad. Desde juegos en el parque hasta actividades en casa, aprende cómo fomentar un estilo de vida activo y saludable.',
      author: 'Fisioterapeuta Carlos González',
      date: '2025-10-30',
      image: 'https://via.placeholder.com/400x300?text=Motor+Skills',
      category: 'Desarrollo'
    },
    {
      id: 5,
      title: 'Tendencias en Juguetes 2025',
      excerpt: 'Las tendencias más importantes en juguetes para este año...',
      content: 'El mundo de los juguetes está en constante evolución. En 2025, vemos un aumento en juguetes sostenibles, tecnología educativa inteligente, y productos inclusivos. Exploraremos las tendencias que están transformando la industria de juguetes, desde la realidad aumentada hasta materiales ecológicos, y cómo estas innovaciones benefician a los niños.',
      author: 'Analista de Mercado Roberto Silva',
      date: '2025-10-25',
      image: 'https://via.placeholder.com/400x300?text=Trends+2025',
      category: 'Tendencias'
    },
    {
      id: 6,
      title: 'Juguetes Inclusivos: Diversidad para Todos',
      excerpt: 'Exploramos la importancia de juguetes inclusivos para niños con diferentes capacidades...',
      content: 'Todos los niños merecen acceso a juguetes que promuevan diversión e inclusión. Los juguetes inclusivos están diseñados considerando diferentes capacidades físicas, cognitivas y sensoriales. En este artículo aprendemos sobre diseño universal, accesorios adaptativos, y cómo elegir juguetes que permitan que todos los niños jueguen y se diviertan juntos.',
      author: 'Especialista en Inclusión Natalia Flores',
      date: '2025-10-20',
      image: 'https://via.placeholder.com/400x300?text=Inclusive+Toys',
      category: 'Inclusión'
    }
  ];

  const categories = ['Todos', ...new Set(blogs.map(b => b.category))];
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredBlogs = selectedCategory === 'Todos' 
    ? blogs 
    : blogs.filter(b => b.category === selectedCategory);

  return (
    <div className="blogs-page-container">
      <div className="blogs-header">
        <h1>Blog ZoneKids</h1>
        <p>Consejos, tendencias y guías sobre juguetes y desarrollo infantil</p>
      </div>

      {/* --- FILTRO DE CATEGORÍAS --- */}
      <div className="blogs-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- GRID DE BLOGS --- */}
      {filteredBlogs.length > 0 ? (
        <div className="blogs-grid">
          {filteredBlogs.map(blog => (
            <div key={blog.id} className="blog-card">
              <img src={blog.image} alt={blog.title} className="blog-image" />
              <div className="blog-content">
                <span className="blog-category">{blog.category}</span>
                <h3>{blog.title}</h3>
                <p className="blog-excerpt">{blog.excerpt}</p>
                <div className="blog-meta">
                  <span className="blog-author">Por {blog.author}</span>
                  <span className="blog-date">{new Date(blog.date).toLocaleDateString('es-CL')}</span>
                </div>
                <button 
                  className="btn-read-more"
                  onClick={() => setSelectedBlog(blog)}
                >
                  Leer Completo →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-blogs">No hay artículos en esta categoría</p>
      )}

      {/* --- MODAL DEL BLOG COMPLETO --- */}
      {selectedBlog && (
        <div className="blog-modal-overlay" onClick={() => setSelectedBlog(null)}>
          <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedBlog(null)}>✕</button>
            
            <img src={selectedBlog.image} alt={selectedBlog.title} className="modal-image" />
            
            <div className="modal-content">
              <span className="modal-category">{selectedBlog.category}</span>
              <h2>{selectedBlog.title}</h2>
              
              <div className="modal-meta">
                <span>Por <strong>{selectedBlog.author}</strong></span>
                <span>{new Date(selectedBlog.date).toLocaleDateString('es-CL')}</span>
              </div>

              <div className="modal-text">
                {selectedBlog.content}
              </div>

              <div className="modal-actions">
                <button className="btn-share">📤 Compartir</button>
                <button className="btn-save">❤️ Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
