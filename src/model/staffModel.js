const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // ✅ native bcrypt

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: { type: String, enum: ["super_admin", "admin"], default: "admin" },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// 🔹 Virtual field for confirm password
staffSchema
  .virtual("confirmPassword")
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

// 🔹 Validate confirmPassword before saving
staffSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    if (this.password !== this._confirmPassword) {
      throw new Error("Passwords do not match");
    }
  }
  next();
});

// 🔹 Hash password using bcrypt before saving
staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔹 Compare entered password with hashed password
staffSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = staffSchema;
