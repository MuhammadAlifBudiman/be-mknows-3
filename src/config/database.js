// Database configuration file for Sequelize ORM
// Loads environment variables for database connection
const { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

module.exports = {
  /**
   * Development environment configuration
   * @property {string} dialect - Database dialect (PostgreSQL)
   * @property {string} host - Database host from environment variable
   * @property {string} username - Database username from environment variable
   * @property {string} password - Database password from environment variable
   * @property {string} database - Database name from environment variable
   * @property {number} port - Database port from environment variable
   * @property {object} define - Sequelize model definition options
   * @property {object} pool - Connection pool settings
   * @property {boolean} logQueryParameters - Log query parameters in development
   * @property {boolean} logging - Disable SQL query logging
   * @property {boolean} benchmark - Disable query benchmarking
   */
  development: {
    dialect: "postgres", // Use PostgreSQL as the database
    host: DB_HOST, // Database host
    username: DB_USER, // Database username
    password: DB_PASSWORD, // Database password
    database: DB_DATABASE, // Database name
    port: DB_PORT, // Database port
    define: {
      underscored: true, // Use snake_case for automatically added attributes
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
      paranoid: true, // Enable soft deletes (adds deletedAt column)
      createdAt: "created_at", // Custom name for createdAt timestamp
      updatedAt: "updated_at", // Custom name for updatedAt timestamp
      deletedAt: "deleted_at", // Custom name for deletedAt timestamp
    },
    pool: {
      min: 0, // Minimum number of connections in pool
      max: 5, // Maximum number of connections in pool
    },
    logQueryParameters: NODE_ENV === "development", // Log query parameters only in development
    logging: false, // Disable SQL query logging
    benchmark: false, // Disable query benchmarking
  },
  /**
   * Production environment configuration
   * (Same structure as development, but can be customized for production needs)
   */
  production: {
    dialect: "postgres", // Use PostgreSQL as the database
    host: DB_HOST, // Database host
    username: DB_USER, // Database username
    password: DB_PASSWORD, // Database password
    database: DB_DATABASE, // Database name
    port: DB_PORT, // Database port
    define: {
      underscored: true, // Use snake_case for automatically added attributes
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
      paranoid: true, // Enable soft deletes (adds deletedAt column)
      createdAt: "created_at", // Custom name for createdAt timestamp
      updatedAt: "updated_at", // Custom name for updatedAt timestamp
      deletedAt: "deleted_at", // Custom name for deletedAt timestamp
    },
    logging: false, // Disable SQL query logging
    benchmark: false, // Disable query benchmarking
  }
}