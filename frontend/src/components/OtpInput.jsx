import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import '../css/OtpInput.css';

// OtpInput component - OTP verification ke liye 6-digit code input
const OtpInput = ({ onComplete, onResend, loading = false }) => {
  // OTP digits store karne ke liye array
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]); // Input fields ke references

  // Input change handle karne ka function
  const handleChange = (index, value) => {
    // Sirf numbers allow karta hai
    if (value && !/^\d$/.test(value)) {
      return;
    }

    // OTP array update karta hai
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Agar current field mein value hai aur next field available hai
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus(); // Next field par focus karta hai
    }

    // Agar complete OTP hai to parent ko notify karta hai
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      onComplete(newOtp.join('')); // Complete OTP parent ko bhejta hai
    }
  };

  // Backspace handle karne ka function
  const handleKeyDown = (index, e) => {
    // Backspace key press
    if (e.key === 'Backspace') {
      // Agar current field empty hai aur previous field available hai
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus(); // Previous field par focus karta hai
      }
    }
  };

  // Paste handle karne ka function
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const pastedDigits = pastedData.replace(/\D/g, '').slice(0, 6); // Sirf numbers extract karta hai

    if (pastedDigits.length === 6) {
      // Pasted OTP set karta hai
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedDigits[i] || '';
      }
      setOtp(newOtp);

      // Last field par focus karta hai
      inputRefs.current[5]?.focus();

      // Complete OTP parent ko notify karta hai
      onComplete(pastedDigits);
    }
  };

  // Clear OTP function
  const handleClear = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus(); // First field par focus karta hai
  };

  // Resend OTP function
  const handleResend = () => {
    if (onResend) {
      onResend();
    }
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      {/* OTP Title */}
      <Typography variant="h6" gutterBottom>
        Enter OTP
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        We've sent a 6-digit code to your email/phone
      </Typography>

      {/* OTP Input Fields */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
        {otp.map((digit, index) => (
          <TextField
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            inputProps={{
              maxLength: 1,
              style: { textAlign: 'center', fontSize: '1.2rem' }
            }}
            sx={{
              width: '50px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: digit ? 'primary.main' : 'grey.300',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
            disabled={loading}
          />
        ))}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={handleClear}
          disabled={loading}
        >
          Clear
        </Button>

        <Button
          variant="text"
          onClick={handleResend}
          disabled={loading}
          color="primary"
        >
          Resend OTP
        </Button>
      </Box>

      {/* Loading State */}
      {loading && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Verifying OTP...
        </Typography>
      )}

      {/* Instructions */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Didn't receive the code? Check your spam folder or try resending.
      </Typography>
    </Box>
  );
};

export default OtpInput;
