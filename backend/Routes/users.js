const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../Models/user");
const router = express.Router();

// User data fetch karne ka route - user ID se
router.get("/:id", async (req, res) => {
  try {
    const user_id = req.params.id; // URL se user ID extract karta hai
    const user = await User.findById(user_id); // Database se user data fetch karta hai
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // User nahi mila
    }
    res.json(user); // User data return karta hai
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User registration ka route - new user banane ke liye
router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password, isAdmin } = req.body; // Request body se data extract

    // Check karta hai ki user already exist karta hai ya nahi
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // New user object create karta hai
    const newUser = new User({
      username,
      email,
      password,
      isAdmin,
    });

    // Password ko hash karta hai security ke liye
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // User ko database mein save karta hai
    await newUser.save();
    const token = newUser.generateAuthToken(); // Authentication token generate karta hai

    // Response data prepare karta hai
    const data = {
      token,
      userId: newUser.id,
      username: newUser.username,
      isAdmin: newUser.isAdmin,
    };
    res.status(201).json(data); // Success response
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login ka route - existing user login karne ke liye
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // Request body se credentials

    // Database se user find karta hai email se
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Password verify karta hai - hash compare karta hai
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Login successful - token generate karta hai
    const token = user.generateAuthToken();
    const data = {
      token,
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
    res.json(data); // Success response
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Email check karne ka route - registration ke time duplicate email check ke liye
router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Database mein email check karta hai
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return res.json({ exists: true }); // Email already exist karta hai
    } else {
      return res.json({ exists: false }); // Email available hai
    }
  } catch (err) {
    console.error("Error checking email:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// Authentication middleware - protected routes ke liye
const authMiddleware = require('../middleware/auth');

// Username update karne ka route - user profile update ke liye
router.put('/update-username/:userId',authMiddleware, async (req, res) => {
  console.log('PUT /update-username called');
  try {
    const { userId } = req.params; // URL se user ID
    const { username } = req.body; // New username

    // Database se user find karta hai
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Username update karta hai
    user.username = username;
    await user.save();

    console.log('Username updated successfully');
    res.status(200).json({ message: 'Username updated successfully' });
  } catch (err) {
    console.error('Error updating username:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Email update karne ka route - user profile update ke liye
router.put('/update-email/:userId',authMiddleware, async (req, res) => {
  console.log('PUT /update-email called');
  try {
    const { userId } = req.params; // URL se user ID
    const { email } = req.body; // New email

    // Database se user find karta hai
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Email update karta hai
    user.email = email;
    await user.save();

    console.log('Email updated successfully');
    res.status(200).json({ message: 'Email updated successfully' });
  } catch (err) {
    console.error('Error updating email:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Password change karne ka route - security ke liye
router.put('/change-password/:userId', authMiddleware, async (req, res) => {
  console.log('PUT /change-password called');
  try {
    const { userId } = req.params; // URL se user ID
    const { oldPassword, newPassword } = req.body; // Old aur new password

    // Database se user find karta hai
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Old password verify karta hai
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      console.log('Incorrect old password');
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // New password ko hash karta hai aur save karta hai
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    console.log('Password changed successfully');
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// User account delete karne ka route - account removal ke liye
router.delete('/delete-account/:userId', authMiddleware, async (req, res) => {
  console.log('DELETE /delete-account called');

  try {
    const { userId } = req.params; // URL se user ID
    const user = await User.findById(userId); // Database se user find
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // User ko database se delete karta hai
    await user.deleteOne();

    console.log('Account deleted successfully');
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
