const BusinessUsers = require("../model/businessUserModel");
const ShopVerify = require("../model/shopDetailsModel");
const Admin = require("../model/adminModel")


const createShopVerification = async (req, res) => {
    try {
        const {
            ownerId,
            gstNumber,
            panNumber,
            aadharNumber,
            address,
            shopLogo,
            shopPhotos,
        } = req.body;

        console.log("req ", req.body);

        // -------------------- VALIDATIONS -------------------- //

        if (!ownerId) {
            return res.status(400).json({ message: "ownerId is required" });
        }

        // Aadhaar required
        if (!aadharNumber) {
            return res.status(400).json({ message: "Aadhaar number is required" });
        }

        // Business Logo required
        if (!shopLogo) {
            return res.status(400).json({ message: "Business logo is required" });
        }

        // shopPhotos can be optional but must be array
        let photos = Array.isArray(shopPhotos) ? shopPhotos : [];

        // -------------------- SAVE DATA -------------------- //
        const shopData = new ShopVerify({
            ownerId,
            gstNumber,
            panNumber,
            aadharNumber,
            address,
            shopLogo,
            shopPhotos: photos,
        });

        await shopData.save();

        // UPDATE business user
        await BusinessUsers.findByIdAndUpdate(
            ownerId,
            { isAddPersonal: true, shopVerification: shopData._id },
            { new: true }
        );

        res.status(201).json({
            message: "Shop verification details saved successfully",
            shopVerification: shopData,
        });

    } catch (err) {
        console.error("❌ Error saving shop verification:", err);
        res.status(500).json({ error: err.message });
    }
};



const getAllShopVerifications = async (req, res) => {
    try {
        const user = await BusinessUsers.find({ isVerified: false })
            .populate("businessLocation")
            .populate("businessHours")
            .populate("shopVerification");

        res.status(200).json({
            message: "All requests fetched successfully",
            count: user.length,
            data: user
        });

    } catch (err) {
        console.error("❌ Error fetching all shop verifications:", err);
        res.status(500).json({ error: err.message });
    }
};



const updateVerificationStatus = async (req, res) => {
    try {

        const { businessId, status, verifiedBy, verificationNotes } = req.body;

        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid verification status" });
        }

        const shopData = await BusinessUsers.findById(businessId);
        if (!shopData) {
            return res.status(404).json({ message: "Shop not found" });
        }

        // Update fields
        shopData.verificationStatus = status;
        shopData.verifiedBy = verifiedBy || null;
        shopData.verificationNotes = verificationNotes || null;
        shopData.verifiedAt = new Date();
        shopData.isVerified = status === "approved";

        await shopData.save();

        // ✔ FIX: Fetch admin who verified
        let verifiedUser = null;
        if (verifiedBy) {
            verifiedUser = await Admin.findById(verifiedBy).select("name email");
        }

        res.status(200).json({
            message: "Verification status updated successfully",
            shopVerification: {
                id: shopData._id,
                verificationStatus: shopData.verificationStatus,
                isVerified: shopData.isVerified,
                verifiedBy: verifiedUser
                    ? {
                        id: verifiedUser._id,
                        name: verifiedUser.name,
                        email: verifiedUser.email
                    }
                    : null,
                verificationNotes: shopData.verificationNotes,
                verifiedAt: shopData.verifiedAt,
            },
        });

    } catch (err) {
        console.error("❌ Error updating verification status:", err);
        res.status(500).json({ error: err.message });
    }
};

const getShopDetailsByBusinessId = async (req, res) => {
    try {
        const { businessId } = req.params;
        //console.log("req",req.params)

        if (!businessId) {
            return res.status(400).json({ message: "businessId is required" });
        }

        // Find business user to get shopVerification ID
        const businessUser = await BusinessUsers.findById(businessId)
            .select("shopVerification");

        if (!businessUser || !businessUser.shopVerification) {
            return res.status(404).json({ message: "Shop verification not found" });
        }

        // Fetch only shop verification document
        const business = await BusinessUsers.findById(businessId)
            .populate("businessLocation")
            .populate("businessHours")
            .populate({
                path: "shopVerification",
            });

        if (!business) {
            return res.status(404).json({ message: "Business details not found" });
        }

        res.status(200).json({
            message: "Business details fetched successfully",
            data: business
        });

    } catch (err) {
        console.error("❌ Error fetching business details:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createShopVerification,
    getAllShopVerifications,
    updateVerificationStatus,
    getShopDetailsByBusinessId
};