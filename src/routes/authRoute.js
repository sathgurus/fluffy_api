const express = require("express");
const router = express.Router();

const {
    register,
    verifyOTP,
    login,
    getUserById
} = require("../controllers/authController");
const { createShopVerification,getAllShopVerifications,updateVerificationStatus, } = require("../controllers/shopVerifyController");
const { setBusinessHours, getBusinessHours } = require("../controllers/businessHoursController");
const { setBusinessLocation } = require("../controllers/locationController");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/user/:id", getUserById);
router.post("/business-verification",createShopVerification)
router.get("/verification-requests",getAllShopVerifications)
router.post("/verify-business",updateVerificationStatus)
router.post("/business-hours",setBusinessHours);
router.get('/business-hours/:businessId', getBusinessHours);
router.post("/ping-location",setBusinessLocation)

module.exports = router;
