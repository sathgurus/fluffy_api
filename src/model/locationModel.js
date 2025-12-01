const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "BusinessUsers",
  },

  address: { type: String, required: false },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    }
  },

  radius: { type: Number, default: 300 }, // in meters  
});

locationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Locations", locationSchema,"Locations");
