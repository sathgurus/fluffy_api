const { connectAdminDB, connectBusinessOwnerDB, connectEndUserDB } = require("./config/db");
const userSchema = require("./model/userModel");
const businessSchema = require("./model/businessDetailsModel");
const locationSchema = require("./model/locationModel");
const serviceSchema = require("./model/serviceModel");
const shopVerificationSchema = require("./model/shopverifyModel");
const staffSchema = require("./model/staffModel");

async function initDatabases() {
    try {
        
        const AdminUser = connectAdminDB.model("User", userSchema);
        const Staff = connectAdminDB.model("Staff", staffSchema);
        const BusinessUser = connectBusinessOwnerDB.model("User", userSchema);
        const Business = connectBusinessOwnerDB.model("BusinessDetails", businessSchema);
        const BusinessLocation = connectBusinessOwnerDB.model("Location", locationSchema);
        const BusinessService = connectBusinessOwnerDB.model("Service", serviceSchema);
        const ShopVerification = connectBusinessOwnerDB.model("ShopVerification", shopVerificationSchema);
        const EndUser = connectEndUserDB.model("User", userSchema);


        
        await AdminUser.createCollection();
        await Staff.createCollection();
        await BusinessUser.createCollection();
        await Business.createCollection();
        await BusinessLocation.createCollection()
        await BusinessService.createCollection();
        await ShopVerification.createCollection();
        await EndUser.createCollection();

        console.log("✅ Databases and user collections created successfully!");
    } catch (err) {
        console.error("❌ Error initializing databases:", err);
    }
}

module.exports = { initDatabases };
