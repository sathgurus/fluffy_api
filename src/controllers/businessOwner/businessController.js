const { connectBusinessOwnerDB } = require("../../config/db");
const Business = require("../../model/businessDetailsModel");

// Create Business model for Business Owner DB

// 📩 Add Business Details
const addBusinessController = async (req, res) => {
  try {
    const {
      businessName,
      businessDescription,
      businessPhone,
      alternatePhone,
      businessEmail,
      businessWebsite,
      ownerId,
    } = req.body;

    // Check required fields
    if (!businessName || !businessPhone || !ownerId) {
      return res.status(400).json({
        message: "Business name, phone, and ownerId are required",
      });
    }

    // Create new business document
    const newBusiness = new Business({
      businessName,
      businessDescription,
      businessPhone,
      alternatePhone,
      businessEmail,
      businessWebsite,
      ownerId,
    });

    await newBusiness.save();

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
