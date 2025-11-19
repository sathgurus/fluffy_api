const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },           // stored file URL (S3 / CDN / local)
    filename: { type: String, default: null },
    mimeType: { type: String, default: null },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const shopVerificationSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // GST
    gstNumber: {
      type: String,
      default: null,
      trim: true,
      // optional basic GSTIN pattern (India) — adjust or remove if not needed
      match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format"],
    },
    gstDocument: {
      type: fileSchema,
      default: null, // if user uploaded a GST pdf/photo
    },

    // PAN
    panNumber: {
      type: String,
      default: null,
      trim: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"],
    },
    panDocument: {
      type: fileSchema,
      default: null,
    },

    // Aadhar
    aadharNumber: {
      type: String,
      default: null,
      trim: true,
      match: [/^[0-9]{12}$/, "Invalid Aadhar number"], // optional validation
    },
    aadharDocument: {
      type: fileSchema,
      default: null,
    },

    // Address: structured fields + optional document/photo
    address: {
      line1: { type: String, default: "" },
      line2: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    addressDocument: {
      type: fileSchema, // scanned proof of address (pdf/photo)
      default: null,
    },

    // Shop media
    shopLogo: {
      type: fileSchema,
      default: null,
    },
    shopPhotos: {
      type: [fileSchema],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 3; // limit to 3 photos
        },
        message: "You can upload up to 3 shop photos",
      },
    },

    // Verification metadata
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin who verified
      default: null,
    },
    verificationNotes: {
      type: String,
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },

    // Helpful flags
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = shopVerificationSchema;