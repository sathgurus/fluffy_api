const bcrypt = require('bcrypt');
const fs = require("fs");
const path = require("path");

// Import models
const User = require('../model/users');
const Admin = require('../model/admin');
const DefaultService = require('../model/defaultService');

async function seedDefaultData() {
    try {

        console.log("⏳ Seeding default data...");

        // ================================
        // 🔹 1. Seed Super Admin
        // ================================
        const existingAdmin = await Admin.findOne({ email: 'admin@petshop.com' });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);

            await Admin.create({
                name: 'Super Admin',
                email: 'admin@petshop.com',
                password: hashedPassword,
                role: 'super_admin',
            });

            console.log('✅ Super Admin created');
        } else {
            console.log('ℹ️ Super Admin already exists');
        }

        // ================================
        // 🔹 2. Seed Default Services (from JSON)
        // ================================
        const filePath = path.join(__dirname, "../config/", "servicesSampleData.json");
        const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        const existingServices = await DefaultService.find();

        if (existingServices.length === 0) {
            await DefaultService.insertMany(jsonData);
            console.log("✅ Default services inserted");
        } else {
            console.log("ℹ️ Services already exist");
        }

        // ================================
        // 🔹 3. Initialize Indexes (Very important)
        // ================================
        await Promise.all([
            User.init(),
            Admin.init(),
            DefaultService.init(),
        ]);

        console.log("🌟 Seeding completed successfully!");

    } catch (err) {
        console.error("❌ Seeding Error:", err);
    }
}

module.exports = seedDefaultData;
