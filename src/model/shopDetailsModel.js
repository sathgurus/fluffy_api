const mongoose = require("mongoose");

const shopVerificationSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessUsers",
      required: true,
      index: true,
    },

    // GST
    gstNumber: { type: String, default: null },
    gstDocument: { type: String, default: null },

    // PAN
    panNumber: { type: String, default: null },
    panDocument: { type: String, default: null },

    // Aadhar
    aadharNumber: { type: String, default: null },
    aadharDocument: { type: String, default: null },

    // ⭐ TIN (Optional)
    tinNumber: {
      type: String,
      default: null,   // optional
    },

    // Address
    address: {
      type: String,
      default: "",
    },
    addressDocument: {
      type: String,
      default: null,
    },

    // Shop media
    shopLogo: { type: String, default: null },
    shopPhotos: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShopVerify", shopVerificationSchema);
