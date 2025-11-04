const express = require("express");
const {
  createShopVerification,
  getShopVerificationByOwner,
  updateVerificationStatus,
} = require("../controllers/businessOwner/shopVerifyController");

const router = express.Router();

// POST → Submit shop verification details
router.post("/", createShopVerification);

// GET → Fetch by owner ID
router.get("/:ownerId", getShopVerificationByOwner);

// PATCH → Update verification status (admin use)
router.patch("/:id", updateVerificationStatus);

module.exports = router;
