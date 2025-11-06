const { connectBusinessOwnerDB } = require("../../config/db");
const Business = require("../../model/businessDetailsModel");
const { getDbConnections } = require("../../utils/dbConnections");
const userSchema = require("../../model/userModel")
// Create Business model for Business Owner DB

// 📩 Add Business Details
const addBusinessController = async (req, res) => {
  try {
    const { adminConn, ownerConn, customerConn } = getDbConnections();
    const businessAdd = ownerConn.model("BusinessDetails", Business);
    const AdminUser = adminConn.model("User", userSchema);
    const BusinessOwnerUser = ownerConn.model("User", userSchema);
    const EndUserUser = customerConn.model("User", userSchema);
    const {
      businessName,
      businessDescription,
      businessPhone,
      alternatePhone,
      businessEmail,
      businessWebsite,
      ownerId,
    } = req.body;

    const user = await AdminUser.findById(ownerId);
    if (!user) return res.status(404).json({ message: "User not found" });




    // Check required fields
    if (!businessName || !businessPhone || !ownerId) {
      return res.status(400).json({
        message: "Business name, phone, and ownerId are required",
      });
    }

    // Create new business document
    const newBusiness = new businessAdd({
      businessName,
      businessDescription,
      businessPhone,
      alternatePhone,
      businessEmail,
      businessWebsite,
      ownerId,
    });

    await newBusiness.save();

    user.isAddBusiness = true;
     await user.save({ validateBeforeSave: false });

    if (user.role === "business_owner") {
      const otherUser = await BusinessOwnerUser.findById(ownerId);
       if (otherUser) {
        otherUser.isAddBusiness = true
        await otherUser.save({ validateBeforeSave: false });
       }
      
    } else if (user.role === "end_user") {
      const otherUser = await EndUserUser.findById(ownerId);
      if (otherUser) {
        otherUser.isAddBusiness = true
        await otherUser.save({ validateBeforeSave: false });
      }
      
    }

    res.status(201).json({
      message: "Business details added successfully",
      businessId: newBusiness._id,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// 📋 Get all businesses for a specific owner (optional)
const getBusinessesByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const businesses = await Business.find({ ownerId });
    res.status(200).json({ businesses });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = { addBusinessController, getBusinessesByOwner };
