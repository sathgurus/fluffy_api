// src/models/initModels.js

const AdminUser = require('../model/userModel');
const BusinessOwnerUser = require('../model/userModel');
const EndUserUser = require('../model/userModel');

function initModels(adminConn, ownerConn, customerConn) {
  // Attach models to their respective DB connections
  adminConn.models = {
    AdminUser: adminConn.model('User', AdminUser),
  };

  ownerConn.models = {
    BusinessOwnerUser: ownerConn.model('User', BusinessOwnerUser),
  };

  customerConn.models = {
    EndUserUser: customerConn.model('User', EndUserUser),
  };

  console.log("✅ Models initialized for all databases");
  return { adminConn, ownerConn, customerConn };
}

module.exports = initModels;
