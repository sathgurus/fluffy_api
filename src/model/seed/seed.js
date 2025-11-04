const bcrypt = require('bcrypt');
const User = require('../userModel');
const Admin = require('../adminModel');
const fs = require("fs");
const path = require("path");
const Services = require("../serviceModel");

async function seedDefaultData(dbConnections) {
    try {
        const { adminConn, ownerConn, customerConn } = dbConnections;
        const filePath = path.join(__dirname, "../../config/", "servicesSampleData.json");
        const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));


        const AdminUser = adminConn.model('Admin', Admin);
        const Users = await adminConn.model('User', User);
        const BusinessOwners = await ownerConn.model('User', User);
        const EndUsers = await customerConn.model('User', User);
        const ServicesModel = adminConn.model("Services", Services);

        const existingAdmin = await AdminUser.findOne({ email: 'admin@petshop.com' });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            await AdminUser.create({
                name: 'Super Admin',
                email: 'admin@petshop.com',
                password: hashedPassword,
                role: 'super_admin', // must match enum in schema
            });
            console.log('✅ Super Admin seeded');
        } else {
            console.log('ℹ️ Super Admin already exists, skipping seed');
        }




        await Promise.all([
            Users.init(),
            BusinessOwners.init(),
            EndUsers.init(),

        ]);

        const existingCategories = await ServicesModel.find();
        if (existingCategories.length === 0) {
            await ServicesModel.insertMany(jsonData);
            console.log("✅ Sample categories and services seeded");
        } else {
            console.log("ℹ️ Categories already exist, skipping seed");
        }

        console.log("🌟 Seeding complete!");

        console.log('✅ All collections initialized');
    } catch (err) {
        console.error('❌ Seed error:', err);
    }
}

module.exports = seedDefaultData;
