const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // auto-generates id
    name: { type: String, required: true },
    price: { type: Number, required: true },

  },
  { timestamps: true }
);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  services: [serviceSchema],
});

module.exports = categorySchema;
