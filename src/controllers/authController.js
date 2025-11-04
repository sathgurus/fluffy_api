const express = require("express");
const router = express.Router();
const {  connectCustomerDB, connectBusinessOwnerDB, connectAdminDB } = require("../config/db");
const userSchema = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const { getDbConnections } = require('../utils/dbConnections');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const register = async (req, res) => {

  try {
    const { adminConn, ownerConn, customerConn } = getDbConnections();
    const AdminUser = adminConn.model("User", userSchema);
    const BusinessOwnerUser = ownerConn.model("User", userSchema);
    const EndUserUser = customerConn.model("User", userSchema);


    const { name, phone, email, password, confirmPassword, termsAccepted, role } = req.body;


    if (!role || !["admin", "business_owner", "end_user"].includes(role)) {
      return res.status(400).json({ message: "Invalid or missing role" });
    }

    const adminUser = new AdminUser({
      name,
      phone,
      email,
      password,
      confirmPassword,
      termsAccepted,
      role,
      otp: 12345,
    });

    await adminUser.save();

    if (role === "business_owner") {
      const businessOwnerUser = new BusinessOwnerUser({
        name,
        phone,
        email,
        password,
        confirmPassword,
        termsAccepted,
        role,
        otp: adminUser.otp, // same OTP
      });
      await businessOwnerUser.save();
    } else if (role === "end_user") {
      const endUser = new EndUserUser({
        name,
        phone,
        email,
        password,
        confirmPassword,
        termsAccepted,
        role,
        otp: adminUser.otp,
      });
      await endUser.save();
    }

    res.status(201).json({
      message: "User registered successfully. OTP sent to phone/email.",
      userId: adminUser._id,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { adminConn, ownerConn, customerConn } = getDbConnections();
    const AdminUser = adminConn.model("User", userSchema);
    const BusinessOwnerUser = ownerConn.model("User", userSchema);
    const EndUserUser = customerConn.model("User", userSchema);

    const { userId, otp } = req.body;


    const user = await AdminUser.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otpVerified = true;
    user.isUserRegister = true
    //user.otp = null;
    await user.save({ validateBeforeSave: false });

    if (user.role === "business_owner") {
      const otherUser = await BusinessOwnerUser.findById(userId);
      if (otherUser) {
        otherUser.otpVerified = true;
        user.isUserRegister = ture
        //otherUser.otp = null;
        await otherUser.save({ validateBeforeSave: false });
      }
    } else if (user.role === "end_user") {
      const otherUser = await EndUserUser.findById(userId);
      if (otherUser) {
        otherUser.otpVerified = true;
        user.isUserRegister = ture
        //otherUser.otp = null;
        await otherUser.save({ validateBeforeSave: false });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        phone: user.phone,
        db: user.role, // optional for identifying DB in next requests
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "OTP verified successfully", user: {
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
    const { adminConn, ownerConn, customerConn } = getDbConnections();
    const AdminUser = adminConn.model("User", userSchema);
    const BusinessOwnerUser = ownerConn.model("User", userSchema);
    const EndUserUser = customerConn.model("User", userSchema);
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Phone number and password are required" });
    }

    const adminUser = await AdminUser.findOne({ phone });
    if (!adminUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    let activeDB;
    if (adminUser.role === "admin") {
      activeDB = connectAdminDB;
    } else if (adminUser.role === "business_owner") {
      activeDB = connectBusinessOwnerDB;
    } else if (adminUser.role === "end_user") {
      activeDB = connectCustomerDB;
    } else {
      return res.status(400).json({ message: "Invalid role configuration" });
    }

    const token = jwt.sign(
      {
        id: adminUser._id,
        role: adminUser.role,
        phone: adminUser.phone,
        db: adminUser.role, // optional for identifying DB in next requests
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        phone: adminUser.phone,
        email: adminUser.email,
        role: adminUser.role,
      },
      dbConnected: adminUser.role,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: err.message });
  }
};


module.exports = { register, verifyOTP, login };
