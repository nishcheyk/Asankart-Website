import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/Login.css";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/authContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? "register" : "login";
      const payload = isRegistering
        ? { username, email, password, isAdmin }
        : { email, password };

      const response = await axios.post(
        `http://localhost:5000/users/${endpoint}`,
        payload
      );

      const { token, userId, isAdmin: isAdminResp } = response.data;
      authContext.login(token, userId, isAdminResp);

      // Persist session
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("isAdmin", isAdminResp);

      navigate(isAdminResp ? "/admin" : "/");

    } catch (err) {
      // Handle backend error messages
      if (err?.response?.data?.error) {
        const msg = err?.response?.data?.error;
        console.log(msg);
        setError(msg);
      } else if (err?.response?.data?.message) {
        const msg = err?.response?.data?.message;
        setError(msg);
        console.log(msg);
      } else {
        setError("Authentication failed");
      }
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
        setOpenSnackbar(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <>
      <NavBar />
      <div className="main1">
        <div className="wrapper1">
          <div className="card-switch">
            <label className="switch">
              <input
                type="checkbox"
                className="toggle"
                checked={isRegistering}
                onChange={() => setIsRegistering(!isRegistering)}
              />
              <span className="slider"></span>
              <span className="card-side"></span>
              <div className="flip-card__inner">
                {/* Login Form */}
                <div className="flip-card__front">
                  <div className="title">Log in</div>
                  <form className="flip-card__form" onSubmit={handleSubmit}>
                    <input
                      className="flip-card__input"
                      name="email"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      className="flip-card__input"
                      name="password"
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button className="flip-card__btn" type="submit">
                      Let's go!
                    </button>
                  </form>
                </div>

                {/* Register Form */}
                <div className="flip-card__back">
                  <div className="title">Sign up</div>
                  <form className="flip-card__form" onSubmit={handleSubmit}>
                    <input
                      className="flip-card__input"
                      placeholder="Username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <input
                      className="flip-card__input"
                      name="email"
                      placeholder="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      className="flip-card__input"
                      name="password"
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button className="flip-card__btn" type="submit">
                      Confirm!
                    </button>
                  </form>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Auth;
