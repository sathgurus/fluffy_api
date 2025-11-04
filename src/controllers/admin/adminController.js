const adminSchema = require("../../model/adminModel");
const { connectAdminDB } = require("../../config/db");

const SuperAdmin = connectAdminDB.model("admins", adminSchema);

const createSuperAdmin = async () => {
  try {
    const existingAdmin = await SuperAdmin.findOne({ email: "admin@petcare.com" });

    if (!existingAdmin) {
      const superAdmin = new SuperAdmin({
        name: "Super Admin",
        email: "admin@petcare.com",
        password: "Admin@123",
      });

      await superAdmin.save();
      console.log("✅ Super Admin account created:");
      console.log("Email: admin@petcare.com");
      console.log("Password: Admin@123");
    } else {
      console.log("🟢 Super Admin already exists");
    }
  } catch (err) {
    console.error("❌ Error creating Super Admin:", err);
  }
};

module.exports = createSuperAdmin;
