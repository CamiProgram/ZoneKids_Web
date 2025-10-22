---
# ZoneKids_Web_React

Sitio web para proyecto semestral sobre un reciente emprendimiento de una tienda virtual llamada "ZoneKids"

---

**Integrantes ( + Gestionamiento )**

* Camilo Tapia (Gestionamiento, Desarrollo Backend y Frontend)
* Danae Collao (Gestionamiento, Desarrollo Frontend, Backend)

---

**Tecnologias Utilizadas**

![React](https://skillicons.dev/icons?i=react)
![Bootstrap](https://skillicons.dev/icons?i=bootstrap)
![Spring Boot](https://skillicons.dev/icons?i=spring)
![VS Code](https://skillicons.dev/icons?i=vscode)
![Vite](https://skillicons.dev/icons?i=vite)
![MySQL](https://skillicons.dev/icons?i=mysql)
![PHP (XAMPP)](https://skillicons.dev/icons?i=php)



---

# Estructuras

Este apartado se enfoca principalmente en el ambito de visualizar en manera no literal las estructuras Front-End y Back-End.

---

**Front-End (React + Vite)**

📁 src/
│
├── 📄 App.jsx
├── 📄 main.jsx
├── 📄 App.css               (Estilos muy generales de la App)
├── 📄 index.css             (Estilos globales: body, reset, fuentes)
│
├── 📁 assets/               (Imágenes, logos, etc.)
│   └── 📄 logo.png
│
├── 📁 components/           (Bloques de UI reusables - Solo Lógica)
│   ├── 📄 AdminSidebar.jsx
│   ├── 📄 CartModal.jsx
│   ├── 📄 Footer.jsx
│   ├── 📄 Navbar.jsx
│   ├── 📄 ProductCard.jsx
│   └── 📄 ProtectedRoute.jsx
│
├── 📁 context/              (Manejo de estado global)
│   ├── 📄 AuthContext.jsx
│   └── 📄 CartContext.jsx
│
├── 📁 layout/               (Plantillas para las páginas - Solo Lógica)
│   ├── 📄 AdminLayout.jsx
│   └── 📄 PublicLayout.jsx
│
├── 📁 pages/                (Las vistas/páginas completas - Solo Lógica)
│   ├── 📁 admin/
│   │   ├── 📄 AdminDashboard.jsx
│   │   ├── 📄 AdminProducts.jsx
│   │   └── 📄 AdminUsers.jsx
│   │
│   └── 📁 user/
│       ├── 📄 HomePage.jsx
│       ├── 📄 LoginPage.jsx
│       ├── 📄 RegisterPage.jsx
│       ├── 📄 CheckoutPage.jsx
│       ├── 📄 ProductDetailPage.jsx
│       ├── 📄 CategoryPage.jsx
│       └── 📄 SearchPage.jsx
│
└── 📁 styles/               (¡Aquí van todos los CSS!)
    │
    ├── 📁 components/         (Estilos para cada componente)
    │   ├── 📄 adminSidebar.css
    │   ├── 📄 cartModal.css
    │   ├── 📄 footer.css
    │   ├── 📄 navbar.css
    │   └── 📄 productCard.css
    │
    ├── 📁 layout/
    │   ├── 📄 adminLayout.css
    │   └── 📄 publicLayout.css
    │
    └── 📁 pages/              (Estilos para cada página)
        ├── 📄 adminDashboard.css
        ├── 📄 adminProducts.css
        ├── 📄 adminUsers.css
        │
        ├── 📄 homePage.css
        ├── 📄 loginPage.css
        ├── 📄 registerPage.css
        ├── 📄 checkoutPage.css
        ├── 📄 productDetailPage.css
        ├── 📄 categoryPage.css
        └── 📄 searchPage.css

---

**Back-End (SpringBoot + Mockito(Testing))**


---


