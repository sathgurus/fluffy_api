const mongoose = require("mongoose");

const defaultServiceSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // auto-generates id
    name: { type: String, required: true },
    //price: { type: Number, required: true },

  },
  {
    timestamps: true,
    autoCreate: false,
    autoIndex: false
  }
);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
    required: false,
  },
  services: [defaultServiceSchema],
});

module.exports = mongoose.model("DefaultServices", categorySchema,"DefaultServices");