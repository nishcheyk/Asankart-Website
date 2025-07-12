import React from "react";

// Authentication Context - pure app mein user login data share karne ke liye
export const AuthContext = React.createContext({
  token: null, // User ka authentication token
  userId: null, // User ka unique ID
  username: null, // User ka username
  isAdmin: false, // Admin hai ya nahi - boolean value
  login: (token, userId, username, isAdmin) => {}, // Login function - placeholder
  logout: () => {}, // Logout function - placeholder
});
