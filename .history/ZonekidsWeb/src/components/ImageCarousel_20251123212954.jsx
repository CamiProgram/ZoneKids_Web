import React, { useState } from 'react';
import '../styles/components/ImageCarousel.css';

export const ImageCarousel = ({ imagenes = [], productName = 'Producto' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

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

    return (
        <div className="image-carousel">
            <div className="carousel-main">
                <img 
                    src={imagenes[currentIndex]} 
                    alt={`${productName} - Imagen ${currentIndex + 1}`} 
                    className="carousel-image"
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
                            <img src={imagen} alt={`Thumbnail ${index + 1}`} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
