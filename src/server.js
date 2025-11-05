require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { initDatabases } = require("./app");
const { initDb } = require("./config/db");
const  initModels  = require('./config/initModels')
const {setDbConnections} = require('./utils/dbConnections')


// Routes
const authRoute = require("./routes/authRoute");
const businessRoute = require("./routes/businessRoute");
const locationRoute = require("./routes/locationRoute");
const serviceRoute = require("./routes/serviceRoute");
const shopVerificationRoute = require("./routes/shopVerifyRoute");
const staffRoutes = require("./routes/staffRoute");
const resetPasswordRoute = require("./routes/passwordResetRoute");
const { connectAdminDB, connectBusinessOwnerDB, connectCustomerDB } = require("./config/db");
const seedDefaultData = require("./model/seed/seed");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use("/api", authRoute);
app.use("/api/business", businessRoute);
app.use("/api/location", locationRoute);
app.use("/api/service", serviceRoute);
app.use("/api/shop-verification", shopVerificationRoute);
app.use("/api/staffs", staffRoutes);
app.use("/api/forgot-password", resetPasswordRoute);

// Connect to Admin DB first
async function startServer() {
  try {
    const { adminConn, ownerConn, customerConn } = await initDb();
    const dbConnections = initModels(adminConn, ownerConn, customerConn);

    // Store connections globally (so controllers can access)
    setDbConnections(dbConnections);

    seedDefaultData();

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}





app.get("/", (req, res) => {
  res.send("Server is running and databases are initialized!");
});

startServer();
