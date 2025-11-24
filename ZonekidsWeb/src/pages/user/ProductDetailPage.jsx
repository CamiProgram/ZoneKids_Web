import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ImageCarousel } from '../../components/ImageCarousel';
import { useCart } from '../../context/CartContext';
import '../../styles/pages/productDetailPage.css'; 

export const ProductDetailPage = () => {
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`http://localhost:8080/api/v1/productos/${id}`);
                setProduct(response.data);
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError("No se pudo cargar el producto.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]); 

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div className="error-message">Producto no encontrado.</div>;
    }

    // --- Variables para descuento y etiquetas ---
    const { nombre, precio, imagenes, precioOriginal, esNuevo, enOferta, descripcion, categoria, stock } = product;
    const tieneDescuento = precioOriginal && precioOriginal > precio;

    return (
        <div className="product-detail-container">
            <div className="product-detail-image">
                {/* --- ETIQUETAS AÑADIDAS --- */}
                <div className="product-badges-detail">
                    {esNuevo && <span className="badge-nuevo">NUEVO</span>}
                    {enOferta && <span className="badge-oferta">OFERTA</span>}
                </div>
                <ImageCarousel imagenes={imagenes} productName={nombre} />
            </div>
            <div className="product-detail-info">
                <h1>{nombre}</h1>
                <p className="product-detail-description">{descripcion || 'Sin descripción disponible.'}</p>
                <p className="product-detail-category">Categoría: {categoria || 'N/A'}</p>
                <p className="product-detail-stock">Stock disponible: {stock}</p>
                
                {/* --- PRECIO CON DESCUENTO AÑADIDO --- */}
                <div className="product-price-wrapper-detail">
                    <span className="product-detail-price">${(precio || 0).toLocaleString()}</span>
                    {tieneDescuento && (
                        <span className="product-price-original-detail">
                            ${(precioOriginal || 0).toLocaleString()}
                        </span>
                    )}
                </div>

                <button 
                    onClick={() => addToCart(product)} 
                    className="add-to-cart-button-detail"
                    disabled={stock === 0} 
                >
                    {stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                </button>
            </div>
        </div>
    );
};