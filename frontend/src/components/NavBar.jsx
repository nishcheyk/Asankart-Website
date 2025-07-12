import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../context/authContext";
import { clearCart } from "../store/cart/cartActions";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import "../css/navBar.css";

// NavBar component - top navigation bar with user menu aur cart
const NavBar = () => {
  const navigate = useNavigate(); // Navigation ke liye
  const dispatch = useDispatch(); // Redux dispatch function
  const { token, username, isAdmin, logout } = useContext(AuthContext); // Auth context

  // Redux store se cart data
  const cartItems = useSelector((state) => state.cartStore.addedItems); // Cart items
  const cartItemCount = cartItems.length; // Cart items count

  // Local state variables
  const [anchorEl, setAnchorEl] = useState(null); // User menu anchor
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null); // Mobile menu anchor

  // User menu open karne ka function
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // User menu close karne ka function
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  // Mobile menu open karne ka function
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  // Mobile menu close karne ka function
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  // Logout function - user ko logout karta hai
  const handleLogout = () => {
    logout(); // Context se logout function call karta hai
    dispatch(clearCart()); // Cart clear karta hai
    handleUserMenuClose(); // Menu close karta hai
    navigate('/'); // Home page par navigate karta hai
  };

  // Settings page par navigate karne ka function
  const handleSettings = () => {
    handleUserMenuClose();
    navigate('/settings');
  };

  // Profile page par navigate karne ka function
  const handleProfile = () => {
    handleUserMenuClose();
    navigate('/profile');
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          E-Commerce Store
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>
          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          <Button color="inherit" component={Link} to="/customer-service">
            Support
          </Button>
        </Box>

        {/* Cart Icon */}
        <IconButton
          color="inherit"
          component={Link}
          to="/cart"
          sx={{ mr: 2 }}
        >
          <Badge badgeContent={cartItemCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* User Menu */}
        {token ? (
          // Logged in user ke liye
          <Box>
            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <PersonIcon />
              </Avatar>
            </IconButton>

            {/* Desktop User Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfile}>
                <PersonIcon sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleSettings}>
                <SettingsIcon sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <PersonIcon />
            </IconButton>

            {/* Mobile User Menu */}
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfile}>
                <PersonIcon sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleSettings}>
                <SettingsIcon sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          // Guest user ke liye - login button
          <Button
            color="inherit"
            component={Link}
            to="/login"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            Login
          </Button>
        )}

        {/* Admin Panel Link - sirf admin ke liye */}
        {isAdmin && (
          <Button
            color="inherit"
            component={Link}
            to="/admin"
            sx={{ ml: 1 }}
          >
            Admin Panel
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
