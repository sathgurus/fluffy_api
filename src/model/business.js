const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
    },
    businessDescription: {
      type: String,
      default: "", // optional
    },
    businessPhone: {
      type: String,
      required: [true, "Business phone number is required"],
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    alternatePhone: {
      type: String,
      default: "", // optional
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    businessEmail: {
      type: String,
      default: "", // optional
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    businessWebsite: {
      type: String,
      default: "", // optional
      match: [
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/,
        "Please enter a valid website URL",
      ],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Business owner reference is required"],
    },
  },
  { timestamps: true }
);

module.exports = businessSchema;