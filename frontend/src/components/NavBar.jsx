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
  const [username, setUsername] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
    setUsername(localStorage.getItem("username"));
  }, []);

  const goTo = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  const logOut = () => {
    localStorage.clear();
    setIsAdmin(null);
    setToken(null);
    setUsername(null);
    authContext.logout();
    navigate("/");
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-menu">
        <button className="navbar-button" onClick={() => goTo("/")}>
          <span className="button-content">Home</span>
        </button>

        {isAdmin ? (
          <>
            <button className="admin-button" onClick={() => goTo("/addProduct")}>
              <span className="button-content">+ Add Product</span>
            </button>
            <button className="admin-button" onClick={() => goTo("/order")}>
              <span className="button-content">All Orders</span>
            </button>
          </>
        ) : (
          <>
            <button className="navbar-button" onClick={() => goTo("/about")}>
              <span className="button-content">About Us</span>
            </button>
            <button className="navbar-button" onClick={() => goTo("/contact")}>
              <span className="button-content">Contact Us</span>
            </button>
            <button className="navbar-button" onClick={() => goTo("/customer-service")}>
              <span className="button-content">Customer Service</span>
            </button>
          </>
        )}
      </div>

      <button className="navbar-logo-btn" onClick={() => goTo("/")}>
        <img className="navbar-logo" src={logo} alt="Logo" />
      </button>

      <div className="navbar-items">
        {!isAdmin && (
          <div className="tooltip-wrapper">
            <button
              className="navbar-cart"
              onClick={() => goTo("/cart")}
            >
              <span className="button-content">🛒</span>
              {items.length > 0 && <span className="cart-count">{items.length}</span>}
            </button>
          </div>
        )}

        {token ? (
          <div className="dropdown-container">
            <button
              className="navbar-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="button-content">{username || "Account"} ▼</span>
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => goTo("/settings")}>Settings</button>
                <button className="dropdown-item" onClick={() => goTo("/faq")}>FAQ</button>
                {!isAdmin && (
                  <button className="dropdown-item" onClick={() => goTo("/order")}>My Orders</button>
                )}
                <button className="dropdown-item" onClick={logOut}>Log Out</button>
              </div>
            )}
          </div>
        ) : (
          <button className="navbar-button" onClick={() => goTo("/login")}>
            <span className="button-content">Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
