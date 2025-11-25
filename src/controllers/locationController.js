const { model } = require("mongoose");
const BusinessLocation = require("../model/locationModel");
const getAddress = require("./helper/getAddressHelper");
const BusinessUsers = require("../model/businessUserModel")

const setBusinessLocation = async (req, res) => {
    try {
        const { businessId } = req.query;
        const { latitude, longitude, radius } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                message: "Latitude & longitude are required",
            });
        }

        // 🔥 Step: Get exact address from lat long (FREE)
        const address = await getAddress(latitude, longitude);

        if (!address) {
            return res.status(400).json({
                message: "Unable to fetch exact address",
            });
        }

        let data = await BusinessLocation.findOne({ businessId });

        if (!data) {
            data = new BusinessLocation({
                businessId,
                address,  // auto filled
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
                radius: radius || 300,
            });
        } else {
            data.address = address;
            data.location = {
                type: "Point",
                coordinates: [longitude, latitude],
            };
            data.radius = radius || data.radius;
        }

        await data.save();


        await BusinessUsers.findByIdAndUpdate(
            businessId,
            {
                isAddLocation: true,
                businessLocation: data._id
            },
            { new: true }
        );

        res.status(200).json({
            message: "Shop location saved successfully",
            data,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const getBusinessLocation = async (req, res) => {
    try {
        const { businessId } = req.params;

        const data = await BusinessLocation.findOne({ businessId });

        if (!data) {
            return res.status(404).json({
                message: "Business location not set",
            });
        }

        res.status(200).json({
            message: "Business location fetched successfully",
            data,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const getNearbyShops = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        const shops = await BusinessLocation.find({
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [longitude, latitude] },
                    $maxDistance: 300
                }
            }
        });

        res.status(200).json({
            message: "Nearby shops fetched",
            shops,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};




module.exports = { setBusinessLocation, getBusinessLocation, getNearbyShops }