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
    const {
      name,
      businessName,
      businessType,
      businessPhone,
      altPhone,
      businessEmail,
      password,
      confirmPassword,
      termsAccepted,
      role,
      businessWebsite
    } = req.body;

    console.log(req.body)

    // 🔹 Validate required fields
    if (!name || !businessName || !businessPhone || !businessType ||  !password || !confirmPassword) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // 🔹 Validate terms
    if (!termsAccepted) {
      return res.status(400).json({ message: "You must accept terms & conditions" });
    }

    // 🔹 Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 🔹 Validate role
    if (!role || !["admin", "owner", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid or missing role" });
    }

    // 🔹 Check existing user by phone or email
    const existingPhone = await User.findOne({ businessPhone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // const existingEmail = await User.findOne({ businessEmail });
    // if (existingEmail) {
    //   return res.status(400).json({ message: "Email already registered" });
    // }

    // 🔹 Generate OTP
    const otp = "12345"; // generateOTP();  // use your logic later

    // 🔹 Create user
    const newUser = new User({
      name,
      businessName,
      businessType,
      businessPhone,
      altPhone,
      businessEmail,
      password,
      confirmPassword,
      termsAccepted,
      role,
      otp,
      otpVerified: false,
      businessWebsite,
      isUserRegister: true
    });

    // 🔹 Save to DB (password will be hashed by pre-save hook)
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully. OTP sent.",
      userId: newUser._id,
      otp, // REMOVE in production
    });

  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
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
    const { businessPhone, password } = req.body;

    console.log(req.body)

    if (!businessPhone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    const user = await User.findOne({ businessPhone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔒 Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔍 ❗ Owner must be verified to login
    if (user.role === "owner" && user.isVerified === false) {
      return res.status(403).json({
        isVerified:false,
        user:user,
        message: "Your business is not verified. Please contact customer care.",
      });
    }

    // 🔐 Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        phone: user.businessPhone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: user,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message });
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
