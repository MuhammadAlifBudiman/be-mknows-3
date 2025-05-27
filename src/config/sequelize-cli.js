// sequelize-cli.js - Sequelize CLI configuration file
// Loads environment variables from a .env file based on NODE_ENV
const { config } = require('dotenv');
// Load .env.<NODE_ENV>.local or default to .env.development.local
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// Destructure database connection variables from process.env
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

/**
 * Sequelize CLI configuration object
 * @type {Object}
 * @property {string} username - Database username from environment variable DB_USER
 * @property {string} password - Database password from environment variable DB_PASSWORD
 * @property {string} database - Database name from environment variable DB_DATABASE
 * @property {string|number} port - Database port from environment variable DB_PORT
 * @property {string} host - Database host from environment variable DB_HOST
 * @property {string} dialect - Database dialect (e.g., 'postgres')
 * @property {string} migrationStorageTableName - Table name for Sequelize migrations
 * @property {string} seederStorageTableName - Table name for Sequelize seeders
 */
module.exports = {
  username: DB_USER, // Database username
  password: DB_PASSWORD, // Database password
  database: DB_DATABASE, // Database name
  port: DB_PORT, // Database port
  host: DB_HOST, // Database host
  dialect: 'postgres', // Database dialect
  migrationStorageTableName: 'sequelize_migrations', // Table for migration history
  seederStorageTableName: 'sequelize_seeds', // Table for seed history
};