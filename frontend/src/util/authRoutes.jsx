import React from "react";
import { AuthContext } from "../context/authContext";
import { useLocation, Navigate } from "react-router-dom";

// RequiredAuth component - protected routes ke liye authentication check karta hai
const RequiredAuth = ({ children }) => {
  // AuthContext se user data fetch karta hai
  const authContext = React.useContext(AuthContext);
  // Current location track karta hai - redirect ke liye
  const location = useLocation();
  // LocalStorage se token check karta hai
  const token = localStorage.getItem("token");

  // Agar token nahi hai to login page par redirect karta hai
  if (token === null && authContext.token === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Agar token hai to protected content show karta hai
  return children;
};

export default RequiredAuth;
