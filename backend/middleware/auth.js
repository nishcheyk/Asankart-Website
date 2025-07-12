const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authentication middleware - har request mein token verify karta hai
function isAuth(req, res, next) {
  // Request header se Authorization token extract karta hai
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false; // Token nahi hai to false mark karta hai
    return next(); // Request continue karta hai
  }

  // Bearer token format se actual token extract karta hai
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    {
      req.isAuth = false; // Token empty hai to false mark karta hai
      return next(); // Request continue karta hai
    }
  }

  try {
    // JWT token verify karta hai - secret key se decode karta hai
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Decoded user data request mein add karta hai
    req.isAuth = true; // Authentication successful mark karta hai
    next(); // Request continue karta hai
  } catch (ex) {
    // Token invalid hai to false mark karta hai
    req.isAuth = false;
    next(); // Request continue karta hai
  }
}

module.exports = isAuth;
