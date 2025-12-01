const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    ],
    required: true
  },
  isOpen: { type: Boolean, default: false },
  openTime: { type: String, default: null },   // Example: "09:00 AM"
  closeTime: { type: String, default: null },  // Example: "08:00 PM"
});

const businessHoursSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessUsers", required: true },
  hours: [daySchema],
});

module.exports = mongoose.model("BusinessHours", businessHoursSchema,"BusinessHours");
