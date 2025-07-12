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

// Main App component - ye pure application ka root component hai
function App() {
  // User login data ka state - token, userId, username, admin status store karta hai
  const [userLoggedData, setUserLoggedData] = useState({
    token: null,
    userId: null,
    username: null,
    isAdmin: false,
  });

  // Loading state - jab app load ho raha hai tab show karta hai
  const [loading, setLoading] = useState(true);

  // Component mount hone par localStorage se user data load karta hai
  useEffect(() => {
    // LocalStorage se user data fetch karta hai
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    // Agar token aur userId hai to user logged in hai
    if (token && userId) {
      setUserLoggedData({ token, userId, username, isAdmin });
    }
    setLoading(false); // Loading complete
  }, []);

  // Login function - user login karne par data store karta hai
  const login = (token, userId, username, isAdmin) => {
    // LocalStorage mein user data save karta hai
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("isAdmin", isAdmin);
    // State update karta hai
    setUserLoggedData({ token, userId, username, isAdmin });
  };

  // Logout function - user logout karne par data clear karta hai
  const logout = () => {
    // State ko reset karta hai
    setUserLoggedData({ token: null, userId: null, username: null, isAdmin: false });
    // LocalStorage se data remove karta hai
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
  };

  // Agar loading hai to Loader component show karta hai
  if (loading) return <Loader />;

  return (
    // AuthContext Provider - pure app mein authentication data provide karta hai
    <AuthContext.Provider
      value={{
        token: userLoggedData.token,
        userId: userLoggedData.userId,
        username: userLoggedData.username,
        isAdmin: userLoggedData.isAdmin,
        login, // Login function provide karta hai
        logout, // Logout function provide karta hai
      }}
    >
      {/* Routes - different pages ke liye routing */}
      <Routes>
        {/* Public routes - bina login ke access kar sakte hain */}
        <Route path="/" element={<HomePage />} /> {/* Home page */}
        <Route path="/login" element={<AuthPage />} /> {/* Login/Register page */}
        <Route path="/cart" element={<CartPage />} /> {/* Shopping cart */}
        <Route path="/contact" element={<ContactUs />} /> {/* Contact us page */}
        <Route path="/about" element={<Aboutus />} /> {/* About us page */}
        <Route path="/customer-service" element={<Coustmerserivce />} /> {/* Customer chat */}
        <Route path="/order" element={<OrdersPage />} /> {/* User orders */}
        <Route path="/faq" element={<FAQ />} /> {/* FAQ page */}
        <Route path="*" element={<Error404 />} /> {/* 404 error page */}
        <Route path="/product/:id" element={<ProductPage />} /> {/* Individual product page */}

        {/* Protected routes - sirf logged in users access kar sakte hain */}
        <Route
          path="/addProduct"
          element={
            <RequiredAuth> {/* RequiredAuth wrapper - login check karta hai */}
              <AddProductPage />
            </RequiredAuth>
          }
        />
        <Route
          path="/update/:id"
          element={
            <RequiredAuth> {/* Product update page - admin only */}
              <UpdateProductPage />
            </RequiredAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequiredAuth> {/* Admin dashboard */}
              <HomePage />
            </RequiredAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequiredAuth> {/* User settings page */}
              <Settings />
            </RequiredAuth>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
