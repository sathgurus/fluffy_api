const mongoose = require("mongoose");

const shopVerificationSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // GST
    gstNumber: { type: String, default: null },
    gstDocument: { type: String, default: null }, // file URL

    // PAN
    panNumber: { type: String, default: null },
    panDocument: { type: String, default: null },

    // Aadhar
    aadharNumber: { type: String, default: null },
    aadharDocument: { type: String, default: null },

    // Address (simple)
    address: {
      type: String,
      default: "",
    },
    addressDocument: {
      type: String, // URL of proof
      default: null,
    },

    // Shop media
    shopLogo: { type: String, default: null },
    shopPhotos: {
      type: [String], // array of URLs
      default: [],
    },

    // Verification
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verificationNotes: { type: String, default: null },
    verifiedAt: { type: Date, default: null },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShopVerify", shopVerificationSchema);
