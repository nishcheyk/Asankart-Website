// Authentication utility functions - login/logout ke liye helper functions

// User ko login karne ka function - token aur user data store karta hai
export const loginUser = (token, userId, username, isAdmin) => {
  // LocalStorage mein user data save karta hai
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("username", username);
  localStorage.setItem("isAdmin", isAdmin);
};

// User ko logout karne ka function - sab data clear karta hai
export const logoutUser = () => {
  // LocalStorage se sab data remove karta hai
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("isAdmin");
};

// Check karta hai ki user logged in hai ya nahi
export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return token !== null; // Token hai to logged in hai
};

// Check karta hai ki user admin hai ya nahi
export const isAdminUser = () => {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin === "true"; // Admin hai to true return karta hai
};

// User ka current data get karne ka function
export const getCurrentUser = () => {
  return {
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    isAdmin: localStorage.getItem("isAdmin") === "true"
  };
};
