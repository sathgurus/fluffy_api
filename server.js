require("dotenv").config();
const express = require("express");
const cors = require("cors");

const runMigrations = require("./src/config/migrationHelper");
const seedDefaultData = require("./src/config/seedDefaultData");
const connectDB = require("./src/config/db");

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
    try {
        // 1️⃣ Connect to MongoDB
        await connectDB();

        // 2️⃣ Run migrations
        await runMigrations();

        // 3️⃣ Seed default data
        await seedDefaultData();

        // 4️⃣ Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server start error:", error);
        process.exit(1);
    }
}

startServer();
