const User = require("../../model/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { connectAdminDB } = require("../../config/db")
const userSchema = require("../../model/userModel");

// Utility to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


/**
 * Send OTP to email
 * POST /api/users/send-otp
 */
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await AdminUser.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = 123456;
        user.resetOTP = otp;
        user.otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry
        await user.save({ validateBeforeSave: false });

        // Send OTP via email
        // const transporter = nodemailer.createTransport({
        //     service: "gmail",
        //     auth: {
        //         user: process.env.SMTP_USER,
        //         pass: process.env.SMTP_PASS,
        //     },
        // });

        // await transporter.sendMail({
        //     from: process.env.SMTP_USER,
        //     to: user.email,
        //     subject: "Password Reset OTP",
        //     html: `<p>Hello ${user.name},</p>
        //      <p>Your OTP for password reset is: <b>${otp}</b></p>
        //      <p>OTP expires in 15 minutes.</p>`,
        // });

        res.status(200).json({ message: "OTP sent to email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * Reset password using OTP
 * POST /api/users/reset-password
 */
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await AdminUser.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.resetOTP !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetOTP = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { sendOTP, resetPassword };
