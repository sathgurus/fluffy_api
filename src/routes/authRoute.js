const express = require("express");
const router = express.Router();

const {
    register,
    verifyOTP,
    login,
    getUserById
} = require("../controllers/authController");
const { createShopVerification,getAllShopVerifications,updateVerificationStatus, } = require("../controllers/shopVerifyController")

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/user/:id", getUserById);
router.post("/personal-details",createShopVerification)
router.get("/verification-requests",getAllShopVerifications)

module.exports = router;
