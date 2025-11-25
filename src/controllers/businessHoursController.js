const BusinessHours = require("../model/businessHoursModel");
const BusinessUsers = require("../model/businessUserModel")

const setBusinessHours = async (req, res) => {
    try {
        const { businessId } = req.query;
        const { hours } = req.body;

        if (!hours || !Array.isArray(hours) || hours.length !== 7) {
            return res.status(400).json({
                message: "Hours array must contain 7 days",
            });
        }

        let data = await BusinessHours.findOne({ businessId });

        if (!data) {
            data = new BusinessHours({
                businessId,
                hours,
            });
        } else {
            data.hours = hours;
        }

        await data.save();

        await BusinessUsers.findByIdAndUpdate(
            businessId,
            { isBusinessHours: true ,businessHours: data._id },
            { new: true }
        );

        res.status(200).json({
            message: "Business hours updated successfully",
            data,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


module.exports = { setBusinessHours };