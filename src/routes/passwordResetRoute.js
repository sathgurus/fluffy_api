const express = require("express");
const router = express.Router();
const { sendOTP, resetPassword } = require("../controllers/businessOwner/passwordResetController");

router.post("/send-otp", sendOTP);         // Step 1: Send OTP
router.post("/reset-password", resetPassword); // Step 2: Reset password

module.exports = router;
