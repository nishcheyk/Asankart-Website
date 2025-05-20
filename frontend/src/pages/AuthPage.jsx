import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/authContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import OtpInput from "../components/OtpInput";
import "../css/Login.css";


const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // OTP States for Signup
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtpVerified, setSignupOtpVerified] = useState(false);
  const [signupOtp, setSignupOtp] = useState("");

  // Forgot Password States
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/users/login`, {
        email: form.email,
        password: form.password,
      });

      const { token, userId, isAdmin: isAdminResp } = response.data;
      authContext.login(token, userId, isAdminResp);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("isAdmin", isAdminResp);

      navigate(isAdminResp ? "/admin" : "/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
      setOpenSnackbar(true);
    }
  };

  const sendSignupOtp = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields before proceeding.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const check = await axios.post("http://localhost:5000/users/check-email", { email: form.email });

      if (check.data.exists) {
        setError("Email is already registered. Please login or reset your password.");
        setOpenSnackbar(true);
        return;
      }

      await axios.post("http://localhost:5000/emailOtp/send-otp-signup", { email: form.email });
      setSignupOtpSent(true);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
      setError("Signup error: " + msg);
      setOpenSnackbar(true);
    }

  };

  const verifySignupOtp = async () => {
    try {
      await axios.post("http://localhost:5000/emailOtp/verify-otp", { email: form.email, otp: signupOtp });
      setSignupOtpVerified(true);
    } catch (err) {
      setError("Invalid OTP: " + err?.response?.data?.message);
      setOpenSnackbar(true);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupOtpVerified) return;

    try {
      await axios.post("http://localhost:5000/users/register", { ...form, isAdmin });
      setIsRegistering(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
      setOpenSnackbar(true);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/emailOtp/send-otp`, { email: resetEmail });
      setShowOtpInput(true);
    } catch (err) {
      setError("Error sending OTP: " + err.message);
      setOpenSnackbar(true);
    }
  };

  const verifyResetOtp = async (otp) => {
    try {
      await axios.post(`http://localhost:5000/emailOtp/verify-otp`, { email: resetEmail, otp });
      setIsOtpVerified(true);
    } catch (err) {
      setError("Invalid OTP: " + err.message);
      setOpenSnackbar(true);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/emailOtp/reset-password`, {
        email: resetEmail,
        newPassword,
      });
      setForgotPassword(false);
    } catch (err) {
      setError("Reset failed: " + err.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <NavBar />
      <div className="auth-modern__container">
        <div className="auth-modern__box">
          <div className="auth-modern__toggle">
            <button
              className={!isRegistering && !forgotPassword ? "active" : ""}
              onClick={() => {
                setIsRegistering(false);
                setForgotPassword(false);
              }}
            >
              Login
            </button>
            <button
              className={isRegistering && !forgotPassword ? "active" : ""}
              onClick={() => {
                setIsRegistering(true);
                setForgotPassword(false);
              }}
            >
              Sign Up
            </button>
          </div>

          {forgotPassword ? (
            <div className="auth-modern__form">
              <h2>{showOtpInput ? (isOtpVerified ? "Reset Password" : "Verify OTP") : "Forgot Password"}</h2>
              {!showOtpInput ? (
                <form onSubmit={handleForgotPassword}>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                  <button type="submit">Send OTP</button>
                </form>
              ) : !isOtpVerified ? (
                <OtpInput length={4} onOtpChange={verifyResetOtp} />
              ) : (
                <form onSubmit={resetPassword}>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button type="submit">Reset Password</button>
                </form>
              )}
            </div>
          ) : !isRegistering ? (
            <form className="auth-modern__form" onSubmit={handleLogin}>
              <h2>Login</h2>
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleInputChange} required />
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleInputChange} required />
              <button type="submit">Login</button>
              <div className="auth-modern__link" onClick={() => setForgotPassword(true)}>
                Forgot Password?
              </div>
            </form>
          ) : !signupOtpSent ? (
            <form className="auth-modern__form" onSubmit={sendSignupOtp}>
              <h2>Sign Up</h2>
              <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleInputChange} required />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleInputChange} required />
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleInputChange} required />
              <button type="submit">Send OTP</button>
            </form>
          ) : !signupOtpVerified ? (
            <div className="auth-modern__form">
              <h2>Verify OTP</h2>
              <OtpInput length={4} onOtpChange={setSignupOtp} />
              <button onClick={verifySignupOtp}>Verify</button>
            </div>
          ) : (
            <form className="auth-modern__form" onSubmit={handleSignup}>
              <button type="submit">Register</button>
            </form>
          )}
        </div>
      </div>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>
      </Snackbar>
    </>
  );
};

export default Auth;
