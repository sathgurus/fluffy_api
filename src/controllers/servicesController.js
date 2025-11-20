const Services = require("../model/servicesModel"); // single DB model

// ➕ Add One or Multiple Services
const addServiceController = async (req, res) => {
    try {
        const { businessOwnerId, name, services } = req.body;

        if (!businessOwnerId || !name) {
            return res.status(400).json({
                message: "businessOwnerId and category name are required"
            });
        }

        if (!Array.isArray(services) || services.length === 0) {
            return res.status(400).json({
                message: "services must be an array and cannot be empty"
            });
        }

        const newCategory = new Services({
            name,
            businessOwnerId,
            services: services.map(s => ({
                name: s.name,
                price: s.price
            }))
        });

        await newCategory.save();

        res.status(201).json({
            message: "Services added successfully",
            data: newCategory
        });

    } catch (err) {
        console.error("❌ Error adding services:", err);
        res.status(500).json({ error: err.message });
    }
};



// 📋 Get All Services by Business Owner
const getServicesByOwnerController = async (req, res) => {
  try {
    const { businessOwnerId } = req.query;

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
    const services = await Services.find().sort({ createdAt: -1 });

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
