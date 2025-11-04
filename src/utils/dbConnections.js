

let connections = {};

function setDbConnections({ adminConn, ownerConn, customerConn }) {
  connections = { adminConn, ownerConn, customerConn };
}

function getDbConnections() {
  if (!connections.adminConn || !connections.ownerConn || !connections.customerConn) {
    throw new Error("⚠️ Database connections are not initialized yet.");
  }
  return connections;
}

module.exports = { setDbConnections, getDbConnections };
