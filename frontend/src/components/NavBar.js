import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../img/logo_2.png";
import { AuthContext } from "../context/authContext";
import "../css/navBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const items = useSelector((state) => state.cartStore?.addedItems || []);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, []);

  const goTo = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  const logOut = () => {
    localStorage.clear();
    setIsAdmin(null);
    setToken(null);
    authContext.logout();
    navigate("/");
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-menu">
        <button className="navbar-button" onClick={() => goTo("/about")}>About Us</button>
        <button className="navbar-button" onClick={() => goTo("/contact")}>Contact Us</button>
        <button className="navbar-button" onClick={() => goTo("/customer-service")}>
          Customer Service
        </button>
      </div>

      <button className="navbar-logo-btn" onClick={() => goTo("/")}> <img className="navbar-logo" src={logo} alt="Logo" /></button>

      <div className="navbar-items">
        {!isAdmin && (
          <button className="navbar-cart" onClick={() => goTo("/cart")}>🛒
            {items.length > 0 && <span className="cart-count">{items.length}</span>}
          </button>
        )}

        {token ? (
          <div className="dropdown-container">
            <button className="navbar-button" onClick={() => setShowDropdown(!showDropdown)}>
              Account ▼
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item">Public profile</button>
                <button className="dropdown-item">Settings</button>
                <button className="dropdown-item" onClick={logOut}>Log Out</button>
              </div>
            )}
          </div>
        ) : (
          <button className="navbar-button" onClick={() => goTo("/login")}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
