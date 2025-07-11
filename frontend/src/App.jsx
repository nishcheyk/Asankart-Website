import "./App.css";
import { Route, Routes } from "react-router-dom";
import RequiredAuth from "./util/authRoutes.jsx";
import HomePage from "./pages/HomePage.jsx";
import AddProductPage from "./pages/AddProductPage.jsx";
import UpdateProductPage from "./pages/UpdateProductPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import { AuthContext } from "./context/authContext.jsx";
import { useState, useEffect } from "react";
import OrdersPage from "./pages/OrdersPage.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Loader from "./components/Loader.jsx";
import Error404 from "./components/Error404.jsx";
import Aboutus from "./pages/Aboutus.jsx";
import Coustmerserivce from "./pages/Coustomerchat.jsx";
import FAQ from "./pages/faq.jsx";
import Settings from "./pages/Setting.jsx";
import ProductPage from "./pages/ProductPage.jsx";

function App() {
  const [userLoggedData, setUserLoggedData] = useState({
    token: null,
    userId: null,
    username: null,
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (token && userId) {
      setUserLoggedData({ token, userId, username, isAdmin });
    }
    setLoading(false);
  }, []);

  const login = (token, userId, username, isAdmin) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("isAdmin", isAdmin);
    setUserLoggedData({ token, userId, username, isAdmin });
  };

  const logout = () => {
    setUserLoggedData({ token: null, userId: null, username: null, isAdmin: false });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
  };

  if (loading) return <Loader />;

  return (
    <AuthContext.Provider
      value={{
        token: userLoggedData.token,
        userId: userLoggedData.userId,
        username: userLoggedData.username,
        isAdmin: userLoggedData.isAdmin,
        login,
        logout,
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/customer-service" element={<Coustmerserivce />} />
        <Route path="/order" element={<OrdersPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/product/:id" element={<ProductPage />} />

        {/* Protected routes */}
        <Route
          path="/addProduct"
          element={
            <RequiredAuth>
              <AddProductPage />
            </RequiredAuth>
          }
        />
        <Route
          path="/update/:id"
          element={
            <RequiredAuth>
              <UpdateProductPage />
            </RequiredAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequiredAuth>
              <HomePage />
            </RequiredAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequiredAuth>
              <Settings />
            </RequiredAuth>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
