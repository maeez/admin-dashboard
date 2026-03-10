import Home from "./pages/home/Home";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Users from "./pages/users/Users";
import Products from "./pages/products/Products";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import "./styles/global.scss";
import User from "./pages/user/User";
import Product from "./pages/product/Product";
import Orders from "./pages/orders/Orders";
import Inventory from "./pages/inventory/Inventory";
import Analytics from "./pages/analytics/Analytics";
import Settings from "./pages/settings/Settings";
import { useState } from "react";

function App() {
  const Layout = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
      <div className="main">
        <Navbar onMenuToggle={() => setMenuOpen((prev) => !prev)} />
        <div className="container">
          <div className={`menuContainer${menuOpen ? " menuOpen" : ""}`}>
            <Menu onClose={() => setMenuOpen(false)} />
          </div>
          {menuOpen && (
            <div className="menuOverlay" onClick={() => setMenuOpen(false)} />
          )}
          <div className="contentContainer">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/users", element: <Users /> },
        { path: "/products", element: <Products /> },
        { path: "/users/:id", element: <User /> },
        { path: "/products/:id", element: <Product /> },
        { path: "/orders", element: <Orders /> },
        { path: "/inventory", element: <Inventory /> },
        { path: "/analytics", element: <Analytics /> },
        { path: "/settings", element: <Settings /> },
      ],
    },
    { path: "/login", element: <Login /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;