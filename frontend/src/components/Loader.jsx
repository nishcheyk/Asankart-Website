// components/Loader.js
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import "../css/Loader.css";

// Loader component - loading spinner display karne ke liye
const Loader = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh', // Minimum height set karta hai
        gap: 2, // Spinner aur text ke beech gap
      }}
      className="loader-container"
    >
      {/* Spinning circle - loading indicator */}
      <CircularProgress
        size={60} // Size of spinner
        thickness={4} // Thickness of spinner line
        sx={{
          color: 'primary.main', // Primary color use karta hai
        }}
      />

      {/* Loading message */}
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          mt: 2, // Top margin
          textAlign: 'center', // Center align text
        }}
      >
        {message}
      </Typography>

      {/* Additional loading text */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          textAlign: 'center',
          opacity: 0.7, // Slightly transparent
        }}
      >
        Please wait while we fetch your data...
      </Typography>
    </Box>
  );
};

export default Loader;
