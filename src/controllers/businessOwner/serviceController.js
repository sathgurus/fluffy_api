const { connectBusinessOwnerDB } = require("../../config/db");
const serviceSchema = require("../../model/serviceModel");
const { getDbConnections } = require('../../utils/dbConnections');



// ➕ Add One or Multiple Services
const addServiceController = async (req, res) => {
  try {
    let { businessOwnerId, services } = req.body;
     const { adminConn, ownerConn, customerConn } = getDbConnections();
    const AdminUser = adminConn.model("Services", serviceSchema);
    const BusinessOwner = ownerConn.model("Services", serviceSchema);

    // Validate businessOwnerId
    if (!businessOwnerId) {
      return res.status(400).json({ message: "businessOwnerId is required" });
    }

    // Validate services
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "services must be a non-empty array" });
    }

    // Prepare service documents
    const serviceDocs = services.map((srv) => {
      if (!srv.serviceName || !srv.price) {
        throw new Error("Each service must have serviceName and price");
      }
      return {
        businessOwnerId,
        serviceName: srv.serviceName,
        price: srv.price,
        discount: srv.discount || 0,
      };
    });

    // Insert all at once
    const newServices = await AdminUser.insertMany(serviceDocs);

    res.status(201).json({
      message: "Services added successfully",
      count: newServices.length,
      services: newServices,
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
    const { adminConn, ownerConn, customerConn } = getDbConnections();
    const AdminUser = adminConn.model("Services", serviceSchema);

    const services = await AdminUser.find({ businessOwnerId });

    res.status(200).json({
      message: "Services fetched successfully",
      services,
    });
  } catch (err) {
    console.error("❌ Error fetching services:", err);
    res.status(500).json({ error: err.message });
  }
};


const getAllServices = async (req, res) => {
  try {
    const { adminConn, ownerConn, customerConn } = getDbConnections();
    const AdminUser = adminConn.model("Services", serviceSchema);
    const services = await AdminUser.find().sort({ createdAt: -1 });

    console.log("response",services);

    res.status(200).json({
      message: "All services fetched successfully",
      count: services.length,
      services,
    });
  } catch (err) {
    console.error("❌ Error fetching all services:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addServiceController, getServicesByOwnerController,getAllServices };
