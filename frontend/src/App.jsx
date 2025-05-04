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

function App() {
  const [userLoggedData, setUserLoggedData] = useState({
    token: null,
    userId: null,
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (token && userId) {
      setUserLoggedData({ token, userId, isAdmin });
    }
    setLoading(false);
  }, []);

  const login = (token, userId, isAdmin) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("isAdmin", isAdmin);
    setUserLoggedData({ token, userId, isAdmin });
  };

  const logout = () => {
    setUserLoggedData({ token: null, userId: null, isAdmin: false });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
  };

  if (loading) return <Loader />;

  return (
    <AuthContext.Provider
      value={{
        token: userLoggedData.token,
        userId: userLoggedData.userId,
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
        <Route path="*" element={<Error404 />} />

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
          path="/orders"
          element={
            <RequiredAuth>
              <OrdersPage />
            </RequiredAuth>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
