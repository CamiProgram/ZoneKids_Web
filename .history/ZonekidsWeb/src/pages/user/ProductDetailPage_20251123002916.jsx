import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../../components/ProductCard';
import { productService } from '../../services/productService';
import '../../styles/pages/productDetailPage.css';

export const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdded, setIsAdded] = useState(false);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loadingSimilar, setLoadingSimilar] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await productService.getById(id);
                setProduct(data);

                // Cargar productos similares
                setLoadingSimilar(true);
                const allProducts = await productService.getAll();
                const similar = getSimilarProducts(data, allProducts);
                setSimilarProducts(similar);
                setLoadingSimilar(false);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('No se pudo cargar el producto.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Algoritmo para obtener productos similares
    const getSimilarProducts = (currentProduct, allProducts) => {
        const similar = allProducts
            .filter(p => p.id !== currentProduct.id) // Excluir el producto actual
            .map(p => ({
                ...p,
                score: calculateSimilarity(currentProduct, p)
            }))
            .sort((a, b) => b.score - a.score) // Ordenar por similitud
            .slice(0, 5); // Obtener los 5 más similares
        
        return similar;
    };

    // Calcula puntuación de similitud entre productos
    const calculateSimilarity = (product1, product2) => {
        let score = 0;

        // Misma categoría: +50 puntos
        if (product1.categoria && product2.categoria && 
            product1.categoria.toLowerCase() === product2.categoria.toLowerCase()) {
            score += 50;
        }

        // Similar rango de precio (±30%): +30 puntos
        const priceRange = product1.precio * 0.3;
        if (Math.abs(product1.precio - product2.precio) <= priceRange) {
            score += 30;
        }

        // Ambos nuevos o ambos en oferta: +15 puntos
        if ((product1.esNuevo && product2.esNuevo) || 
            (product1.enOferta && product2.enOferta)) {
            score += 15;
        }

        // Similar cantidad de palabras en nombre (marca similar): +5 puntos
        const name1Words = product1.nombre?.split(' ').length || 0;
        const name2Words = product2.nombre?.split(' ').length || 0;
        if (Math.abs(name1Words - name2Words) <= 2) {
            score += 5;
        }

        return score;
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div className="error-message">Producto no encontrado.</div>;
    }

    const {
        nombre,
        precio,
        imagenesUrl,
        precioOriginal,
        esNuevo,
        enOferta,
        descripcion,
        categoria,
        stock,
    } = product;

    const tieneDescuento = precioOriginal && precioOriginal > precio;
    const imagenPrincipal = imagenesUrl && imagenesUrl.length > 0 ? imagenesUrl[0] : '/assets/Zonekids_logo_web.webp';

    const handleAddToCart = () => {
        addToCart({
            ...product,
            imagenesUrl: Array.isArray(imagenesUrl) ? imagenesUrl : [imagenesUrl]
        });
        
        // Mostrar feedback visual
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="product-detail-container">
            <div className="product-detail-image">
                {/* --- ETIQUETAS --- */}
                <div className="product-badges-detail">
                    {esNuevo && <span className="badge-nuevo">NUEVO</span>}
                    {enOferta && <span className="badge-oferta">OFERTA</span>}
                </div>
                <img src={imagenPrincipal} alt={nombre} />
            </div>
            <div className="product-detail-info">
                <h1>{nombre}</h1>
                <p className="product-detail-description">
                    {descripcion || 'Sin descripción disponible.'}
                </p>
                <p className="product-detail-category">Categoría: {categoria || 'N/A'}</p>
                <p className="product-detail-stock">Stock disponible: {stock}</p>

                {/* --- PRECIO CON DESCUENTO --- */}
                <div className="product-price-wrapper-detail">
                    <span className="product-detail-price">
                        ${(precio || 0).toLocaleString('es-CO')}
                    </span>
                    {tieneDescuento && (
                        <span className="product-price-original-detail">
                            ${(precioOriginal || 0).toLocaleString('es-CO')}
                        </span>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    className={`add-to-cart-button-detail ${isAdded ? 'added' : ''}`}
                    disabled={stock === 0}
                >
                    {stock > 0 ? (isAdded ? '✓ Añadido' : 'Añadir al Carrito') : 'Agotado'}
                </button>
            </div>
        </div>
    );
};