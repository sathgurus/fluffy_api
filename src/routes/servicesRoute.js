const express = require("express");
const router = express.Router();

const {
    addServiceController,
    getServicesByOwnerController,
    getAllServices
} = require("../controllers/servicesController");

// ➕ Add Services (one or multiple)
router.post("/add", addServiceController);

// 📋 Get Services by Business Owner
router.get("/owner-services/:businessOwnerId", getServicesByOwnerController);

// 📋 Get ALL Services (Admin)
router.get("/all", getAllServices);

module.exports = router;
