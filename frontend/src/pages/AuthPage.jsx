import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/Login.css";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/authContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import OtpInput from "../components/OtpInput"; // Make sure this component exists

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Forget password & OTP states
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");

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

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("isAdmin", isAdminResp);

      navigate(isAdminResp ? "/admin" : "/");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Authentication failed";
      setError(msg);
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

  // Forgot password logic
  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:5000/emailOtp/send-otp`, {
        email: resetEmail,
      });
      setShowOtpInput(true);
      setError(null);
    } catch (error) {
      setError("Error sending OTP: " + (error.response?.data?.message || error.message));
      setOpenSnackbar(true);
    }
  };

  const handleOtpChange = async (otp) => {
    if (otp.length === 4) {
      try {
        await axios.post(`http://localhost:5000/emailOtp/verify-otp`, {
          email: resetEmail,
          otp,
        });
        setIsOtpVerified(true);
        setError(null);
      } catch (error) {
        setIsOtpVerified(false);
        setError("Error verifying OTP: " + (error.response?.data?.message || error.message));
        setOpenSnackbar(true);
      }
    }
  };

  const handleNewPasswordSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:5000/emailOtp/reset-password`, {
        email: resetEmail,
        newPassword,
      });

      setForgotPassword(false);
      setShowOtpInput(false);
      setIsOtpVerified(false);
      setError(null);
      setOpenSnackbar(true);
    } catch (error) {
      setError("Error resetting password: " + (error.response?.data?.message || error.message));
      setOpenSnackbar(true);
    }
  };

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
                {forgotPassword ? (
                  <div className="flip-card__front">
                    <div className="title">
                      {showOtpInput ? (isOtpVerified ? "Reset Password" : "Verify OTP") : "Forgot Password"}
                    </div>
                    {!showOtpInput ? (
                      <form className="flip-card__form" onSubmit={handleResetPassword}>
                        <input
                          className="flip-card__input"
                          type="email"
                          placeholder="Enter your email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                        <button className="flip-card__btn" type="submit">Send OTP</button>
                      </form>
                    ) : !isOtpVerified ? (
                      <OtpInput length={4} onOtpChange={handleOtpChange} />
                    ) : (
                      <form className="flip-card__form" onSubmit={handleNewPasswordSubmit}>
                        <input
                          className="flip-card__input"
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <button className="flip-card__btn" type="submit">Reset Password</button>
                      </form>
                    )}
                    <div
                      style={{ marginTop: "10px", cursor: "pointer", color: "#007bff" }}
                      onClick={() => setForgotPassword(false)}
                    >
                      Back to Login
                    </div>
                  </div>
                ) : (
                  <>
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
                        <div
                          style={{ marginTop: "10px", cursor: "pointer", color: "#007bff" }}
                          onClick={handleForgotPassword}
                        >
                          Forgot Password?
                        </div>
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
                  </>
                )}
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
