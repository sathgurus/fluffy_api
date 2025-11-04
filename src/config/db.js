// /config/db.js
const mongoose = require("mongoose");

let adminDB = null;
let businessOwnerDB = null;
let customerDB = null;

// Connect to Admin DB
async function connectAdminDB() {
  if (!adminDB) {
    adminDB = await mongoose.createConnection(process.env.ADMIN_DB_URI);
    console.log("✅ Connected to Admin DB");
  }
  return adminDB;
}

// Connect to Business Owner DB
async function connectBusinessOwnerDB() {
  if (!businessOwnerDB) {
    businessOwnerDB = await mongoose.createConnection(process.env.OWNER_DB_URI);
    console.log("✅ Connected to Business Owner DB");
  }
  return businessOwnerDB;
}

// Connect to Customer DB
async function connectCustomerDB() {
  if (!customerDB) {
    customerDB = await mongoose.createConnection(process.env.CUSTOMER_DB_URI);
    console.log("✅ Connected to Customer DB");
  }
  return customerDB;
}

// Helper: Connect all databases
async function initDb() {
  const adminConn = await connectAdminDB();
  const ownerConn = await connectBusinessOwnerDB();
  const customerConn = await connectCustomerDB();
  return { adminConn, ownerConn, customerConn };
}

// Export all
module.exports = {
  connectAdminDB,
  connectBusinessOwnerDB,
  connectCustomerDB,
  initDb,
  get adminDB() {
    return adminDB;
  },
  get businessOwnerDB() {
    return businessOwnerDB;
  },
  get customerDB() {
    return customerDB;
  },
};
