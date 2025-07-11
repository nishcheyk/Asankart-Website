const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../Models/user");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
      username,
      email,
      password,
      isAdmin,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    const token = newUser.generateAuthToken();

    const data = {
      token,
      userId: newUser.id,
      username: newUser.username,
      isAdmin: newUser.isAdmin,
    };
    res.status(201).json(data);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = user.generateAuthToken();
    const data = {
      token,
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
    res.json(data);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// routes/userRoutes.js
router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error checking email:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// Middleware for authentication
const authMiddleware = require('../middleware/auth');

// 1. Update username
router.put('/update-username/:userId',authMiddleware, async (req, res) => {
  console.log('PUT /update-username called');
  try {
    const { userId } = req.params;
    const { username } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username;
    await user.save();

    console.log('Username updated successfully');
    res.status(200).json({ message: 'Username updated successfully' });
  } catch (err) {
    console.error('Error updating username:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Update email
router.put('/update-email/:userId',authMiddleware, async (req, res) => {
  console.log('PUT /update-email called');
  try {
    const { userId } = req.params;
    const { email } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    user.email = email;
    await user.save();

    console.log('Email updated successfully');
    res.status(200).json({ message: 'Email updated successfully' });
  } catch (err) {
    console.error('Error updating email:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. Change password
router.put('/change-password/:userId', authMiddleware, async (req, res) => {
  console.log('PUT /change-password called');
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      console.log('Incorrect old password');
      return res.status(400).json({ message: 'Incorrect password' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    console.log('Password changed successfully');
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Delete user account
router.delete('/delete-account/:userId', authMiddleware, async (req, res) => {
  console.log('DELETE /delete-account called');

  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    console.log('Account deleted successfully');
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
