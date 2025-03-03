import "./App.css";
import { Route, Routes } from "react-router-dom";
import RequiredAuth from "./util/authRoutes";
import HomePage from "./pages/HomePage";
import AddProductPage from "./pages/AddProductPage";
import UpdateProductPage from "./pages/UpdateProductPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import { AuthContext } from "./context/authContext";
import { useState, useEffect } from "react";
import OrdersPage from "./pages/OrdersPage";
import ContactUs from "./pages/ContactUs";
import Loader from "./components/Loader"; // Import Loader component
import Error404 from "./components/Error404";

function App() {
  const [userLoggedData, setUserLoggedData] = useState({
    token: null,
    userId: null,
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async authentication check
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (token && userId) {
      setUserLoggedData({ token, userId, isAdmin });
    }
    setLoading(false); // Stop loading after checking
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

  if (loading) return <Loader />; // Show loader while checking authentication

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
        <Route path="*" element={<Error404 />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
