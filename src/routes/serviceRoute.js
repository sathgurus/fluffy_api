const express = require("express");
const router = express.Router();
const {
  addServiceController,
  getServicesByOwnerController,
  getAllServices
} = require("../controllers/businessOwner/serviceController");

// Add a new service
router.post("/add", addServiceController);


router.get("/all", getAllServices);
router.get("/:businessOwnerId", getServicesByOwnerController);

module.exports = router;
