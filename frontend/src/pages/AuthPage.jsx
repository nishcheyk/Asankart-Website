import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/authContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import OtpInput from "../components/OtpInput";
import "../css/Login.css";

// Authentication page - login, signup, aur forgot password ke liye
const Auth = () => {
  // Form states - login/signup form ke liye
  const [isRegistering, setIsRegistering] = useState(false); // Signup mode hai ya login
  const [form, setForm] = useState({ username: "", email: "", password: "" }); // Form data
  const [isAdmin] = useState(false); // Admin status - default false
  const [error, setError] = useState(null); // Error messages
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar show karne ke liye

  // OTP states - signup ke liye OTP verification
  const [signupOtpSent, setSignupOtpSent] = useState(false); // OTP bhej diya hai ya nahi
  const [signupOtpVerified, setSignupOtpVerified] = useState(false); // OTP verify ho gaya hai ya nahi
  const [signupOtp, setSignupOtp] = useState(""); // OTP input value

  // Forgot password states - password reset ke liye
  const [forgotPassword, setForgotPassword] = useState(false); // Forgot password mode
  const [resetEmail, setResetEmail] = useState(""); // Reset email
  const [showOtpInput, setShowOtpInput] = useState(false); // OTP input show karna hai ya nahi
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Reset OTP verify ho gaya hai ya nahi
  const [newPassword, setNewPassword] = useState(""); // New password

  const navigate = useNavigate(); // Navigation ke liye
  const authContext = useContext(AuthContext); // Authentication context

  // Form input change handle karta hai
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Login function - existing user login karne ke liye
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Backend ko login request bhejta hai
      const response = await axios.post(`http://localhost:5000/users/login`, {
        email: form.email,
        password: form.password,
      });

      // Response se user data extract karta hai
      const { token, userId, username, isAdmin: isAdminResp } = response.data;

      // Context mein login data store karta hai
      authContext.login(token, userId, username, isAdminResp);

      // LocalStorage mein data save karta hai
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("isAdmin", isAdminResp);

      // Admin hai to admin page, nahi to home page par redirect karta hai
      navigate(isAdminResp ? "/admin" : "/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
      setOpenSnackbar(true);
    }
  };

  // Signup OTP bhejne ka function - email verification ke liye
  const sendSignupOtp = async (e) => {
    e.preventDefault();

    // Form validation - sab fields required hain
    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields before proceeding.");
      setOpenSnackbar(true);
      return;
    }

    try {
      // Email already registered hai ya nahi check karta hai
      const check = await axios.post("http://localhost:5000/users/check-email", { email: form.email });

      if (check.data.exists) {
        setError("Email is already registered. Please login or reset your password.");
        setOpenSnackbar(true);
        return;
      }

      // OTP bhejta hai signup ke liye
      await axios.post("http://localhost:5000/emailOtp/send-otp-signup", { email: form.email });
      setSignupOtpSent(true);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
      setError("Signup error: " + msg);
      setOpenSnackbar(true);
    }
  };

  // Signup OTP verify karne ka function
  const verifySignupOtp = async () => {
    try {
      // OTP verify karta hai
      await axios.post("http://localhost:5000/emailOtp/verify-otp", { email: form.email, otp: signupOtp });
      setSignupOtpVerified(true);

      // OTP verify hone ke baad automatically register karta hai
      try {
        await axios.post("http://localhost:5000/users/register", { ...form, isAdmin });
        setIsRegistering(false);
        setError("Registration successful! Please login.");
        setOpenSnackbar(true);
      } catch (err) {
        setError(err?.response?.data?.message || "Registration failed");
        setOpenSnackbar(true);
      }
    } catch (err) {
      setError("Invalid OTP: " + err?.response?.data?.message);
      setOpenSnackbar(true);
    }
  };

  // Signup function - new user register karne ke liye
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupOtpVerified) return; // OTP verify nahi hua to kuch nahi karta

    try {
      await axios.post("http://localhost:5000/users/register", { ...form, isAdmin });
      setIsRegistering(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
      setOpenSnackbar(true);
    }
  };

  // Forgot password function - password reset ke liye
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      // Reset OTP bhejta hai
      await axios.post(`http://localhost:5000/emailOtp/send-otp`, { email: resetEmail });
      setShowOtpInput(true);
    } catch (err) {
      setError("Error sending OTP: " + err.message);
      setOpenSnackbar(true);
    }
  };

  // Reset OTP verify karne ka function
  const verifyResetOtp = async (otp) => {
    try {
      await axios.post(`http://localhost:5000/emailOtp/verify-otp`, { email: resetEmail, otp });
      setIsOtpVerified(true);
    } catch (err) {
      setError("Invalid OTP: " + err.message);
      setOpenSnackbar(true);
    }
  };

  // Password reset karne ka function
  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      // New password set karta hai
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
          {/* Toggle buttons - login, signup, forgot password switch karne ke liye */}
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

          {/* Forgot password form */}
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
          ) : (
            /* Login/Signup form */
            <div className="auth-modern__form">
              <h2>{isRegistering ? "Sign Up" : "Login"}</h2>
              <form onSubmit={isRegistering ? handleSignup : handleLogin}>
                {isRegistering && (
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleInputChange}
                    required
                  />
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInputChange}
                  required
                />
                {isRegistering ? (
                  signupOtpSent ? (
                    <OtpInput length={4} onOtpChange={(otp) => setSignupOtp(otp)} />
                  ) : (
                    <button type="button" onClick={sendSignupOtp}>
                      Send OTP
                    </button>
                  )
                ) : (
                  <button type="submit">Login</button>
                )}
              </form>

              {/* Forgot password link */}
              {!isRegistering && (
                <button
                  className="forgot-password"
                  onClick={() => setForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error snackbar - error messages show karne ke liye */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error?.includes("successful") ? "success" : "error"}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Auth;
