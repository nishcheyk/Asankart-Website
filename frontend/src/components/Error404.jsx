import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import "../css/Error404.css";

// Error404 component - page not found error display karne ke liye
const Error404 = () => {
  const navigate = useNavigate(); // Navigation ke liye

  // Home page par navigate karne ka function
  const handleGoHome = () => {
    navigate('/');
  };

  // Previous page par navigate karne ka function
  const handleGoBack = () => {
    navigate(-1); // Browser history mein peeche jata hai
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh', // Minimum height set karta hai
          textAlign: 'center',
          gap: 3, // Elements ke beech gap
        }}
        className="error-404-container"
      >
        {/* Error Icon - 404 number display */}
        <Box
          sx={{
            fontSize: '8rem',
            fontWeight: 'bold',
            color: 'primary.main',
            lineHeight: 1,
            mb: 2,
          }}
          className="error-404-number"
        >
          404
        </Box>

        {/* Error Title */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
          }}
        >
          Oops! Page Not Found
        </Typography>

        {/* Error Description */}
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          sx={{
            maxWidth: '600px',
            mb: 4,
          }}
        >
          Lagta hai aap jo page dhund rahe hain, woh exist nahi karta.
          Ya to URL galat hai, ya page move/delete ho gaya hai.
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }, // Mobile par column, desktop par row
            alignItems: 'center',
          }}
        >
          {/* Go Home Button */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{
              minWidth: '200px',
              py: 1.5,
              px: 3,
            }}
          >
            Go to Homepage
          </Button>

          {/* Go Back Button */}
          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{
              minWidth: '200px',
              py: 1.5,
              px: 3,
            }}
          >
            Go Back
          </Button>
        </Box>

        {/* Additional Help Text */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 4,
            maxWidth: '500px',
          }}
        >
          Agar aapko lagta hai ki ye error galat hai, to please contact karein
          our support team se. Hum aapki help karne ki koshish karenge.
        </Typography>

        {/* Contact Support Link */}
        <Button
          variant="text"
          color="primary"
          onClick={() => navigate('/contact')}
          sx={{ mt: 2 }}
        >
          Contact Support
        </Button>
      </Box>
    </Container>
  );
};

export default Error404;
