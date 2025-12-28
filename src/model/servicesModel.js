const mongoose = require("mongoose");

const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    name: { type: String, required: true },

    weekdayPrice: { type: Number, required: true },
    weekendPrice: { type: Number, required: true },

    finalWeekdayPrice: { type: Number, required: true },
    finalWeekendPrice: { type: Number, required: true },

    weekdayDiscount: { type: Number, default: 0 },
    weekdayDiscountType: {
      type: String,
      enum: ["Percentage", "Flat"],
      default: "Percentage",
    },

    weekendDiscount: { type: Number, default: 0 },
    weekendDiscountType: {
      type: String,
      enum: ["Percentage", "Flat"],
      default: "Percentage",
    },
  },
  { timestamps: true }
);


const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    businessOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    services: [serviceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Services", categorySchema, "Services");