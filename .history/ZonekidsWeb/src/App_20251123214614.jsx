import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layout/PublicLayout';
import { AdminLayout } from './layout/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas Públicas
import { HomePage } from './pages/user/HomePage';
import { LoginPage } from './pages/user/LoginPage';
import { RegisterPage } from './pages/user/RegisterPage';
import { ProductDetailPage } from './pages/user/ProductDetailPage';
import { CategoryPage } from './pages/user/CategoryPage'; 
import { SearchPage } from './pages/user/SearchPage';
import { CheckoutPage } from './pages/user/CheckoutPage';
import { BlogsPage } from './pages/user/BlogsPage';

// Páginas de Admin
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminUsers } from './pages/admin/AdminUsers';
import { CrearProducto } from './pages/admin/CrearProducto';   // <-- Importar
import { EditarProducto } from './pages/admin/EditarProducto'; // <-- Importar
import { CrearUsuario } from './pages/admin/CrearUsuario';     // <-- Importar
import { EditarUsuario } from './pages/admin/EditarUsuario';   // <-- Importar

function App() {
  return (
    <Routes>
      
      {/* --- RUTAS PÚBLICAS --- */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        {/* Cambié :categoryName a :slug para ser más genérico */}
        <Route path="categoria/:slug" element={<CategoryPage />} /> 
        <Route path="producto/:id" element={<ProductDetailPage />} /> 
        <Route path="buscar" element={<SearchPage />} /> {/* Cambié 'search' a 'buscar' */}
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="blogs" element={<BlogsPage />} />
      </Route>

      {/* --- RUTAS DE ADMIN (Protegidas) --- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} /> 
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* Rutas CRUD Productos */}
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/crear" element={<CrearProducto />} />   {/* <-- AÑADIDA */}
        <Route path="products/editar/:id" element={<EditarProducto />} /> {/* <-- AÑADIDA */}
        
        {/* Rutas CRUD Usuarios */}
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/crear" element={<CrearUsuario />} />         {/* <-- AÑADIDA */}
        <Route path="users/editar/:id" element={<EditarUsuario />} />   {/* <-- AÑADIDA */}
      </Route>

    </Routes>
  );
}

export default App;