const express = require("express");
const router = express.Router();

// Import individual route files
const authRoutes = require("./authRoute");
const serviceRoutes = require("./servicesRoute");
// const bookingRoutes = require("./bookingRoute");

// Attach all routes
router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
// router.use("/bookings", bookingRoutes);

module.exports = router;
