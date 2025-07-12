const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const isAuth = require("./middleware/auth");
const app = express();
const port = 5000;

// Different routes import karta hai - har functionality ke liye alag route
const product = require("./Routes/products"); // Product related APIs
const user = require("./Routes/users"); // User authentication APIs
const order = require("./Routes/orders"); // Order management APIs

// MongoDB database se connect karta hai - local database use kar raha hai
mongoose
  .connect("mongodb://localhost:27017/ECommerce")
  .then(() => console.log("Connected to MongoDB...")) // Success message
  .catch((err) => console.error("Could not connect to MongoDB...")); // Error message

// Middleware setup - sab requests ke liye common functionality
app.use(express.json()); // JSON data parse karne ke liye
app.use(cors()); // Cross-origin requests allow karne ke liye
app.use(isAuth); // Authentication middleware - har request mein check karta hai

// API routes setup - different endpoints ke liye
app.use("/product", product); // Product APIs - /product/... endpoints
app.use("/users", user); // User APIs - /users/... endpoints
app.use("/order", order); // Order APIs - /order/... endpoints
app.use("/chat", require("./Routes/chat")); // Chat APIs - /chat/... endpoints
app.use("/emailOtp", require("./Routes/EmailOtp")); // Email OTP APIs - /emailOtp/... endpoints

// Server start karta hai - port 5000 par listen karta hai
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
