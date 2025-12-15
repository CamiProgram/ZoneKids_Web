/**
 * Productos de prueba para desarrollo
 * Se cargan en localStorage si no hay productos en el backend
 */
export const sampleProducts = [
  {
    id: 1,
    nombre: 'Remera Bebé Algodón',
    descripcion: 'Remera cómoda de algodón 100% para bebés, suave y transpirable',
    precio: 25000,
    precioOriginal: 35000,
    stock: 50,
    categoria: 'Remeras',
    estado: 'activo',
    esNuevo: true,
    enOferta: true,
    imagenesUrl: ['https://via.placeholder.com/400x400?text=Remera+Bebe'],
  },
  {
    id: 2,
    nombre: 'Pantalón Bebé Denim',
    descripcion: 'Pantalón suave en denim para bebés, elástico y cómodo',
    precio: 35000,
    stock: 40,
    categoria: 'Pantalones',
    estado: 'activo',
    esNuevo: true,
    enOferta: false,
    imagenesUrl: ['https://via.placeholder.com/400x400?text=Pantalon+Denim'],
  },
  {
    id: 3,
    nombre: 'Vestido Niña',
    descripcion: 'Vestido colorido para niñas, perfecto para ocasiones especiales',
    precio: 45000,
    precioOriginal: 60000,
    stock: 30,
    categoria: 'Vestidos',
    estado: 'activo',
    esNuevo: false,
    enOferta: true,
    imagenesUrl: ['https://via.placeholder.com/400x400?text=Vestido+Nina'],
  },
  {
    id: 4,
    nombre: 'Sudadera Niño',
    descripcion: 'Sudadera cálida de algodón para niños',
    precio: 40000,
    stock: 25,
    categoria: 'Sudaderas',
    estado: 'activo',
    esNuevo: true,
    enOferta: false,
    imagenesUrl: ['https://via.placeholder.com/400x400?text=Sudadera'],
  },
  {
    id: 5,
    nombre: 'Calcetines Set 5 Pares',
    descripcion: 'Set de 5 pares de calcetines suaves para bebés',
    precio: 15000,
    stock: 100,
    categoria: 'Accesorios',
    estado: 'activo',
    esNuevo: false,
    enOferta: false,
    imagenesUrl: ['https://via.placeholder.com/400x400?text=Calcetines'],
  },
  {
    id: 6,
    nombre: 'Gorro de Lana',
    descripcion: 'Gorro abrigado de lana para invierno',
    precio: 18000,
    precioOriginal: 25000,
    stock: 20,
    categoria: 'Accesorios',
    estado: 'activo',
    esNuevo: false,
    enOferta: true,
    imagenesUrl: ['https://via.placeholder.com/400x400?text=Gorro'],
  },
  {
    id: 7,
    nombre: 'Body Bebé',
    descripcion: 'Body cómodo para bebés, cierre frontal',
    precio: 20000,
    stock: 60,
    categoria: 'Bodys',
    estado: 'activo',
    esNuevo: true,
    enOferta: false,
    imagenesUrl: ['https://via.placeholder.com/400x400?text=Body'],
  },
  {
    id: 8,
    nombre: 'Shorts Niño',
    descripcion: 'Shorts frescos para niños en verano',
    precio: 22000,
    stock: 35,
    categoria: 'Pantalones',
    estado: 'activo',
    esNuevo: false,
    enOferta: false,
    imagenesUrl: ['https://via.placeholder.com/400x400?text=Shorts'],
  },
];

/**
 * Cargar productos de prueba en localStorage si no hay en el backend
 */
export const loadSampleProductsIfNeeded = () => {
  const saved = localStorage.getItem('sampleProducts');
  if (!saved) {
    localStorage.setItem('sampleProducts', JSON.stringify(sampleProducts));
  }
};

/**
 * Obtener productos de prueba desde localStorage
 */
export const getSampleProducts = () => {
  const saved = localStorage.getItem('sampleProducts');
  return saved ? JSON.parse(saved) : [];
};
