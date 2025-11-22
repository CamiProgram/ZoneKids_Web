import React from 'react';
import Slider from 'react-slick';
import '../styles/components/adCarousel.css';

export const AdCarousel = ({ images }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
  };

  return (
    <div className="ad-carousel-container">
      <Slider {...settings}>
        {images.map((imgUrl, index) => (
          <div key={index}>
            <img src={imgUrl} alt={`Anuncio ${index + 1}`} className="ad-image"/>
          </div>
        ))}
      </Slider>
    </div>
  );
};