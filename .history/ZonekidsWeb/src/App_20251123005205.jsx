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
import { PurchaseHistoryPage } from './pages/user/PurchaseHistoryPage';
import { OrderDetailPage } from './pages/user/OrderDetailPage';
import { ContactPage } from './pages/user/ContactPage';
import { AboutUsPage } from './pages/user/AboutUsPage';
import { ShippingPage } from './pages/user/ShippingPage';

// Páginas de Admin
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminUsers } from './pages/admin/AdminUsers';
import { CrearProducto } from './pages/admin/CrearProducto';
import { EditarProducto } from './pages/admin/EditarProducto';
import { CrearUsuario } from './pages/admin/CrearUsuario';
import { EditarUsuario } from './pages/admin/EditarUsuario';

function App() {
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS --- */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="categoria/:slug" element={<CategoryPage />} />
        <Route path="producto/:id" element={<ProductDetailPage />} />
        <Route path="buscar" element={<SearchPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="historial" element={<PurchaseHistoryPage />} />
        <Route path="orden/:id" element={<OrderDetailPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="sobre-nosotros" element={<AboutUsPage />} />
        <Route path="envios" element={<ShippingPage />} />
      </Route>

      {/* --- RUTAS DE ADMIN (Protegidas) --- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Rutas CRUD Productos */}
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/crear" element={<CrearProducto />} />
        <Route path="products/editar/:id" element={<EditarProducto />} />

        {/* Rutas CRUD Usuarios */}
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/crear" element={<CrearUsuario />} />
        <Route path="users/editar/:id" element={<EditarUsuario />} />
      </Route>
    </Routes>
  );
}

export default App;