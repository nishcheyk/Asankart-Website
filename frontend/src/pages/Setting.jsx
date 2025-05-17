import React, { useState } from 'react';
import axios from 'axios';
import '../css/setting.css';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import OtpInput from '../components/OtpInput'; // adjust path if needed
import { useEffect } from 'react'; // if not already imported
const Settings = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


useEffect(() => {
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/users/${userId}`, config);
      setUsername(res.data.username || '');
      setEmail(res.data.email || '');
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setError('Failed to load user details');
    }
  };
  if (userId && token) {
    fetchUserDetails();
  }
}, [userId, token]);

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.put(`http://localhost:5000/users/update-username/${userId}`, { username });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.put(`http://localhost:5000/users/update-email/${userId}`, { email }, config);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.put(
        `http://localhost:5000/users/change-password/${userId}`,
        { oldPassword, newPassword },
        config
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const sendOtpForDeletion = async () => {
    setError('');
    setMessage('');
    try {
      const res = await axios.post(`http://localhost:5000/emailOtp/send-otp`, { email }, config);
      setOtpSent(true);
      setMessage('OTP sent to your email. Please enter it to confirm account deletion.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOtpAndDelete = async () => {
    setError('');
    setMessage('');
    try {
      console.log('Verifying OTP:', otp);
      const res = await axios.post(`http://localhost:5000/emailOtp/verify-otp`, { email, otp });
      console.log('OTP Verification Response:', res.data);
      await handleDeleteAccount();
    } catch (err) {
      console.error('OTP Verification Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete(`http://localhost:5000/users/delete-account/${userId}`, config);
      setMessage(res.data.message || 'Account deleted successfully.');
      localStorage.clear();
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Account deletion failed.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="settings-container">
        <h1>Account Settings</h1>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleUsernameChange} className="settings-form">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <button type="submit">Update Username</button>
        </form>

        <form onSubmit={handleEmailChange} className="settings-form">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit">Update Email</button>
        </form>

        <form onSubmit={handlePasswordChange} className="settings-form">
          <label>Old Password</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <button type="submit">Change Password</button>
        </form>

        {!otpSent ? (
          <button className="delete-account" onClick={sendOtpForDeletion}>
            Delete Account
          </button>
        ) : (
          <div className="otp-section">
            <h2>Verify OTP</h2>
            <OtpInput length={4} onOtpChange={setOtp} />
            <button onClick={verifyOtpAndDelete}>Verify OTP & Delete</button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Settings;
