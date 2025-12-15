import React, { useState } from 'react';
import '../styles/components/ImageCarousel.css';

export const ImageCarousel = ({ imagenes = [], productName = 'Producto' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Función para construir URLs completas
    const getImageUrl = (imagenUrl) => {
        if (!imagenUrl) {
            return '/assets/Zonekids_logo_web.webp';
        }
        // Si es URL absoluta, devolverla tal cual
        if (imagenUrl.startsWith('http')) {
            return imagenUrl;
        }
        // Si es ruta relativa, agregar base URL del backend
        return `http://localhost:8080${imagenUrl.startsWith('/') ? '' : '/'}${imagenUrl}`;
    };

    if (!imagenes || imagenes.length === 0) {
        return (
            <div className="image-carousel-empty">
                <img src="/assets/Zonekids_logo_web.webp" alt={productName} />
            </div>
        );
    }

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? imagenes.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === imagenes.length - 1 ? 0 : prevIndex + 1
        );
    };

    const currentImageUrl = getImageUrl(imagenes[currentIndex]);

    return (
        <div className="image-carousel">
            <div className="carousel-main">
                <img 
                    src={currentImageUrl}
                    alt={`${productName} - Imagen ${currentIndex + 1}`} 
                    className="carousel-image"
                    onError={(e) => {
                        console.error('❌ Error cargando imagen:', currentImageUrl);
                        e.target.src = '/assets/Zonekids_logo_web.webp';
                    }}
                    onLoad={() => {
                        console.log('✅ Imagen cargada:', currentImageUrl);
                    }}
                />
                
                {imagenes.length > 1 && (
                    <>
                        <button 
                            className="carousel-button carousel-button-prev"
                            onClick={goToPrevious}
                            aria-label="Imagen anterior"
                        >
                            ‹
                        </button>
                        <button 
                            className="carousel-button carousel-button-next"
                            onClick={goToNext}
                            aria-label="Siguiente imagen"
                        >
                            ›
                        </button>
                    </>
                )}

                <div className="carousel-counter">
                    {currentIndex + 1} / {imagenes.length}
                </div>
            </div>

            {/* Thumbnails */}
            {imagenes.length > 1 && (
                <div className="carousel-thumbnails">
                    {imagenes.map((imagen, index) => (
                        <button
                            key={index}
                            className={`carousel-thumbnail ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Ir a imagen ${index + 1}`}
                        >
                            <img 
                                src={getImageUrl(imagen)} 
                                alt={`Thumbnail ${index + 1}`}
                                onError={(e) => {
                                    console.error('❌ Error cargando thumbnail:', getImageUrl(imagen));
                                    e.target.src = '/assets/Zonekids_logo_web.webp';
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
