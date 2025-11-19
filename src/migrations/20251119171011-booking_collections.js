module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    await db.createCollection("bookings");
    await db.collection("bookings").createIndex({ user_id: 1 });
    await db.collection("bookings").createIndex({ shop_id: 1 });
    await db.collection("bookings").createIndex({ booking_date: -1 });
    await db.collection("bookings").createIndex({ status: 1 });
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    await db.collection("bookings").drop();
  }
};
