const { connectBusinessOwnerDB } = require("../../config/db");
const ShopVerify = require("../../model/shopverifyModel");



// 📝 Create / Submit Shop Verification Details
const createShopVerification = async (req, res) => {
    try {
        const {
            ownerId,
            gstNumber,
            gstDocument,
            panNumber,
            panDocument,
            aadharNumber,
            aadharDocument,
            address,
            addressDocument,
            shopLogo,
            shopPhotos,
        } = req.body;

        if (!ownerId) {
            return res.status(400).json({ message: "ownerId is required" });
        }

        // At least one identity proof must exist
        if (!gstNumber && !gstDocument && !panNumber && !panDocument && !aadharNumber && !aadharDocument) {
            return res.status(400).json({
                message: "Provide at least one of GST, PAN, or Aadhar (number or document)",
            });
        }

        const shopData = new ShopVerify({
            ownerId,
            gstNumber,
            gstDocument,
            panNumber,
            panDocument,
            aadharNumber,
            aadharDocument,
            address,
            addressDocument,
            shopLogo,
            shopPhotos,
        });

        await shopData.save();

        res.status(201).json({
            message: "Shop verification details submitted successfully",
            shopVerification: shopData,
        });
    } catch (err) {
        console.error("❌ Error saving shop verification:", err);
        res.status(500).json({ error: err.message });
    }
};

// 📋 Get Shop Verification Details by Owner ID
const getShopVerificationByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;

        const shopData = await ShopVerify.findOne({ ownerId });

        if (!shopData) {
            return res.status(404).json({ message: "No shop verification details found" });
        }

        res.status(200).json({
            message: "Shop verification details fetched successfully",
            shopVerification: shopData,
        });
    } catch (err) {
        console.error("❌ Error fetching shop verification:", err);
        res.status(500).json({ error: err.message });
    }
};

// 🛠️ Admin - Update Verification Status
const updateVerificationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Updating verification status for ID:", id);
        const { status, verifiedBy, verificationNotes } = req.body;

        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid verification status" });
        }

        const shopData = await ShopVerify.findById(id);
        if (!shopData) return res.status(404).json({ message: "Shop verification not found" });

        shopData.verificationStatus = status;
        shopData.verifiedBy = verifiedBy || null;
        shopData.verificationNotes = verificationNotes || null;
        shopData.verifiedAt = new Date();
        shopData.isVerified = status === "approved";

        await shopData.save();

        const updatedShop = await ShopVerification.findById(id).populate(
            "verifiedBy",
            "name email"
        );

        res.status(200).json({
            message: "Verification status updated successfully",
            shopVerification: {
                id: updatedShop._id,
                verificationStatus: updatedShop.verificationStatus,
                isVerified: updatedShop.isVerified,
                verifiedBy: updatedShop.verifiedBy
                    ? {
                        id: updatedShop.verifiedBy._id,
                        name: updatedShop.verifiedBy.name,
                        email: updatedShop.verifiedBy.email,
                    }
                    : null,
                verificationNotes: updatedShop.verificationNotes || null,
                verifiedAt: updatedShop.verifiedAt,
            },
        });
    } catch (err) {
        console.error("❌ Error updating verification status:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createShopVerification,
    getShopVerificationByOwner,
    updateVerificationStatus,
};
