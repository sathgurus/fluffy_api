const { connectBusinessOwnerDB } = require("../../config/db");
const Location = require("../../model/locationModel");



// 📍 Add or update location
const updateLocationController = async (req, res) => {
  try {
    const { businessOwnerId, latitude, longitude, address } = req.body;

    if (!businessOwnerId || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update if exists, otherwise create
    const location = await Location.findOneAndUpdate(
      { businessOwnerId },
      { latitude, longitude, address, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Location updated successfully",
      location,
    });
  } catch (err) {
    console.error("❌ Error updating location:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { updateLocationController };
