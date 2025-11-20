const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const User = require("../model/businessUserModel")


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


const register = async (req, res) => {
  try {
    const { name, businessName, phone, alternatePhone, email, password, confirmPassword, termsAccepted, role, business_website } = req.body;



    // Validate role
    if (!role || !["admin", "owner", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid or missing role" });
    }

    if (!name || !phone || !email || !password || !confirmPassword || !businessName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check existing user
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // Generate OTP
    const otp = "12345" //  generateOTP();

    const newUser = new User({
      name,
      businessName, 
      phone, 
      alternatePhone,
      email,
      password: password,
      confirmPassword: confirmPassword,
      termsAccepted,
      role,
      otp,
      otpVerified: false,
      isUserRegister: true,
      business_website
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully. OTP sent.",
      userId: newUser._id,
      otp, // for testing remove later
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};


const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otpVerified = true;
    user.isUserRegister = true;
    await user.save({ validateBeforeSave: false });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        phone: user.phone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "OTP verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};



const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    console.log("Registering user with role:", req.body);

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Comparing passwords for user:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        phone: user.phone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });

  } catch (err) {
    console.error("Error fetching:", err);
    res.status(500).json({ error: err.message });
  }
};



module.exports = { register, verifyOTP, login, getUserById };
