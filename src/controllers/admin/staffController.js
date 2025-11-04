const jwt = require("jsonwebtoken");
const Staff = require("../../model/staffModel");
const { connectAdminDB } = require("../../config/db");
require("dotenv").config();


/**
 * @desc Register new staff (Admin only)
 * @route POST /api/staff/register
 * 
 */

const registerStaff = async (req, res) => {
  try {
    const { name, phone, email, password, confirmPassword, role } = req.body;

    // ✅ Validate required fields
    if (!name || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "Name, phone, password, and confirmPassword are required" });
    }

    // ✅ Check if staff already exists by phone
    const existingStaff = await Staff.findOne({ phone });
    if (existingStaff) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // ✅ Create new staff
    const staff = new Staff({
      name,
      phone,
      email: email || null,
      password,
      confirmPassword,
      role: role || "staff",
    });

    await staff.save();

    res.status(201).json({
      message: "Staff registered successfully",
      staff: {
        id: staff._id,
        name: staff.name,
        phone: staff.phone,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (err) {
    console.error("❌ Error registering staff:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Staff Login (role-based, phone-based login)
 * @route POST /api/staff/login
 */
const loginStaff = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // ✅ Validate
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    // ✅ Find staff by phone
    const staff = await Staff.findOne({ phone });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // ✅ Compare password (correct method)
    const isMatch = await staff.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: staff._id, role: staff.role, phone: staff.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        phone: staff.phone,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc Get all staff (Admin only)
 * @route GET /api/staff
 */
const getAllStaff = async (req, res) => {
  try {
    const staffs = await Staff.find().select("-password");
    res.status(200).json({
      message: "All staff fetched successfully",
      total: staffs.length,
      staffs,
    });
  } catch (err) {
    console.error("❌ Error fetching staff:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerStaff, loginStaff, getAllStaff };
