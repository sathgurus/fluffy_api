require("dotenv").config();

// In this file you can configure migrate-mongo

// migration command = nx run migrate-mongo init

// ---->   npx migrate-mongo create <name-of-migration>   <----
// ---->   npx migrate-mongo up                        <----
// ---->   npx migrate-mongo down                      <----
// ---->   npx migrate-mongo status                    <----


module.exports = {
  mongodb: {
    url: process.env.MONGO_URI,
    databaseName: process.env.DB_NAME,
  },

  migrationsDir: "src/migrations",

  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs"
};
