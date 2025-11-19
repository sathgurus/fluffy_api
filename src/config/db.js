const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });

    console.log("✅ Mongoose Connected:", process.env.DB_NAME);
  } catch (error) {
    console.error("❌ Mongoose Connection Error:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
