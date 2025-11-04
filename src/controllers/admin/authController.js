const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  connectAdminDB,
  connectBusinessOwnerDB,
  connectEndUserDB,
} = require("../../config/db");

const User = require("../../model/userModel");



// 🔑 Login Controller (phone + password)


module.exports = { loginController };
