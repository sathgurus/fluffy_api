const express = require("express");
const { registerStaff, loginStaff, getAllStaff } = require("../controllers/admin/staffController");

const router = express.Router();

router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.get("/", getAllStaff);

module.exports = router;
