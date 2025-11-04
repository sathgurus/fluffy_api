const express = require("express");
const router = express.Router();
const { updateLocationController } = require("../controllers/businessOwner/locationController");

router.post("/ping", updateLocationController);

module.exports = router;
