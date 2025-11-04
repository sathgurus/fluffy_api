const express = require("express");
const router = express.Router();
const { addBusinessController, getBusinessesByOwner } = require("../controllers/businessOwner/businessController");

// Add new business
router.post("/add", addBusinessController);

// Get all businesses by ownerId
router.get("/owner/:ownerId", getBusinessesByOwner);

module.exports = router;
