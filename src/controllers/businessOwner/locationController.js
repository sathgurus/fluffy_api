const { connectBusinessOwnerDB } = require("../../config/db");
const Location = require("../../model/locationModel");
const userSchema = require("../../model/userModel")
const { getDbConnections } = require("../../utils/dbConnections");



// 📍 Add or update location
const updateLocationController = async (req, res) => {
  try {
    const { adminConn, ownerConn, customerConn } = getDbConnections();
    const locationAdd = ownerConn.model("Location", Location);
    const AdminUser = adminConn.model("User", userSchema);
    const BusinessOwnerUser = ownerConn.model("User", userSchema);
    const EndUserUser = customerConn.model("User", userSchema);
    const { businessOwnerId, latitude, longitude, address } = req.body;

    const user = await AdminUser.findById(businessOwnerId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!businessOwnerId || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update if exists, otherwise create
    const location = await locationAdd.findOneAndUpdate(
      { businessOwnerId },
      { latitude, longitude, address, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    user.isAddLocation = true
    user.save({ validateBeforeSave: false })
    if (user.role === "business_owner") {
      const otherUser = await BusinessOwnerUser.findById(businessOwnerId);
      console.log("owner", otherUser)
      if (otherUser) {
        otherUser.isAddLocation = true
        await otherUser.save({ validateBeforeSave: false });
      }
    } else if (user.role === "end_user") {
      const otherUser = await EndUserUser.findById(businessOwnerId);
      console.log("custmore", otherUser)
      if (otherUser) {
        otherUser.isAddLocation = true
        await otherUser.save({ validateBeforeSave: false });
      }
    }


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
