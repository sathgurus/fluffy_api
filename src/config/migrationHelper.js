const migrateMongo = require("migrate-mongo");

async function runMigrations() {
    try {
        const config = {
            mongodb: {
                url: process.env.MONGO_URI,
                databaseName: process.env.DB_NAME,
                options: {}
            },
            migrationsDir: "src/migrations",
            changelogCollectionName: "changelog",
        };

        migrateMongo.config.set(config);

        const { db, client } = await migrateMongo.database.connect();
        const migrated = await migrateMongo.up(db);

        if (migrated.length > 0) {
            console.log("🚀 Migrations applied:", migrated);
        }

        await client.close();
    } catch (error) {
        console.error("❌ Migration Error:", error);
        throw error;
    }
}

module.exports = runMigrations;
