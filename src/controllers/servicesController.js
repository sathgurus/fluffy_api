const Services = require("../model/servicesModel"); // single DB model
const BusinessUsers = require("../model/businessUserModel")
const DefaultServices = require("../model/defaultServiceModel")

// ➕ Add One or Multiple Services
const addServiceController = async (req, res) => {
  try {
    const { businessOwnerId, services } = req.body;

    if (!businessOwnerId) {
      return res.status(400).json({ message: "businessOwnerId is required" });
    }

    // Validate services
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "services must be a non-empty array" });
    }

    const serviceDocs = services.map(cat => ({
      businessOwnerId,
      name: cat.name,
      services: cat.services.map(srv => ({
        name: srv.name,
        price: srv.price,
        discount:srv.discount,
        serviceType:srv.serviceType
      })),
    }));

    const insertedData = await Services.insertMany(serviceDocs);

    await BusinessUsers.findByIdAndUpdate(
      businessOwnerId,
      { isAddService: true, },
      { new: true }
    );

    return res.status(201).json({
      message: "Services added successfully",
      count: insertedData.length,
      services: insertedData,
    });

  } catch (err) {
    console.error("❌ Error adding services:", err);
    res.status(500).json({ error: err.message });
  }
};



// 📋 Get All Services by Business Owner
const getServicesByOwnerController = async (req, res) => {
  try {
    const { businessOwnerId } = req.params;

    const services = await Services.find({ businessOwnerId });

    return res.status(200).json({
      message: "Services fetched successfully",
      services,
    });

  } catch (err) {
    console.error("❌ Error fetching services:", err);
    res.status(500).json({ error: err.message });
  }
};



// 📋 Get ALL Services (Admin)
const getAllServices = async (req, res) => {
  try {
    const services = await DefaultServices.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All services fetched successfully",
      count: services.length,
      services,
    });

  } catch (err) {
    console.error("❌ Error fetching all services:", err);
    res.status(500).json({ error: err.message });
  }
};



module.exports = { addServiceController, getServicesByOwnerController, getAllServices };
