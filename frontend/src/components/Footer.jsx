import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import "../css/Footer.css";

// Footer component - website ka bottom section with links aur contact info
const Footer = () => {
  // Current year get karta hai
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto', // Footer ko bottom mein push karta hai
      }}
      className="footer"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              E-Commerce Store
            </Typography>
            <Typography variant="body2" paragraph>
              Apka trusted online shopping destination. Quality products,
              best prices, aur excellent customer service.
            </Typography>

            {/* Social Media Links */}
            <Stack direction="row" spacing={1}>
              <IconButton
                color="inherit"
                size="small"
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                component={Link}
                to="/"
                color="inherit"
                underline="hover"
              >
                Home
              </MuiLink>
              <MuiLink
                component={Link}
                to="/about"
                color="inherit"
                underline="hover"
              >
                About Us
              </MuiLink>
              <MuiLink
                component={Link}
                to="/products"
                color="inherit"
                underline="hover"
              >
                Products
              </MuiLink>
              <MuiLink
                component={Link}
                to="/contact"
                color="inherit"
                underline="hover"
              >
                Contact
              </MuiLink>
              <MuiLink
                component={Link}
                to="/faq"
                color="inherit"
                underline="hover"
              >
                FAQ
              </MuiLink>
            </Stack>
          </Grid>

          {/* Customer Service Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Customer Service
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                component={Link}
                to="/customer-service"
                color="inherit"
                underline="hover"
              >
                Help Center
              </MuiLink>
              <MuiLink
                component={Link}
                to="/shipping"
                color="inherit"
                underline="hover"
              >
                Shipping Info
              </MuiLink>
              <MuiLink
                component={Link}
                to="/returns"
                color="inherit"
                underline="hover"
              >
                Returns & Exchanges
              </MuiLink>
              <MuiLink
                component={Link}
                to="/track-order"
                color="inherit"
                underline="hover"
              >
                Track Order
              </MuiLink>
              <MuiLink
                component={Link}
                to="/size-guide"
                color="inherit"
                underline="hover"
              >
                Size Guide
              </MuiLink>
            </Stack>
          </Grid>

          {/* Contact Info Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              {/* Email */}
              <Box display="flex" alignItems="center">
                <EmailIcon sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="body2">
                  support@ecommerce.com
                </Typography>
              </Box>

              {/* Phone */}
              <Box display="flex" alignItems="center">
                <PhoneIcon sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="body2">
                  +91 98765 43210
                </Typography>
              </Box>

              {/* Address */}
              <Box display="flex" alignItems="flex-start">
                <LocationIcon sx={{ mr: 1, fontSize: 'small', mt: 0.5 }} />
                <Typography variant="body2">
                  123 Shopping Street,<br />
                  Mumbai, Maharashtra 400001
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Section - Copyright aur additional links */}
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            mt: 4,
            pt: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          {/* Copyright */}
          <Typography variant="body2" color="rgba(255,255,255,0.8)">
            © {currentYear} E-Commerce Store. All rights reserved.
          </Typography>

          {/* Additional Links */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 3 }}
            alignItems="center"
          >
            <MuiLink
              component={Link}
              to="/privacy"
              color="rgba(255,255,255,0.8)"
              underline="hover"
              variant="body2"
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              component={Link}
              to="/terms"
              color="rgba(255,255,255,0.8)"
              underline="hover"
              variant="body2"
            >
              Terms of Service
            </MuiLink>
            <MuiLink
              component={Link}
              to="/sitemap"
              color="rgba(255,255,255,0.8)"
              underline="hover"
              variant="body2"
            >
              Sitemap
            </MuiLink>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
