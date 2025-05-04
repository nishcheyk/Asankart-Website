const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User"); // Assuming you have a User model

let otpStore = {}; // To store OTP temporarily

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "thaparbankingsolutions@gmail.com",
    pass: "blsfjufhejrhszba",
  },
});

// Generate OTP
const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

// Send OTP
router.post("/send-otp-signup", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(404).send("email there");
  }
  try {

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    otpStore[email] = { hashedOtp, email };

    const mailOptions = {
      from: "thaparbankingsolutions@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };
    console.log("started");
    await transporter.sendMail(mailOptions);
    console.log("send");
    res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).send("Error sending OTP");
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).send("Email and OTP are required");
  }

  console.log(`Verifying OTP for email: ${email}, OTP: ${otp}`);

  try {
    const otpData = otpStore[email];
    if (!otpData) {
      return res.status(400).send("OTP not found for this email");
    }

    const isMatch = await bcrypt.compare(otp, otpData.hashedOtp);
    if (isMatch) {
      res.status(200).send("OTP verified successfully");
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Error verifying OTP");
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).send("Email and new password are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });
    res.status(200).send("Password reset successfully");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send("Error resetting password");
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    otpStore[email] = { hashedOtp, email };

    const mailOptions = {
      from: "thaparbankingsolutions@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).send("Error sending OTP");
  }
});
module.exports = router;
