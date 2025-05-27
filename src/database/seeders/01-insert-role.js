// Seeder for inserting default roles into the 'roles' table
// ---------------------------------------------------------
// This file is a Sequelize seeder used to populate the 'roles' table with initial data.
// It defines two roles: ADMIN and USER, each with a unique UUID.

"use strict";

/**
 * @type {import("sequelize-cli").Migration}
 *
 * This seeder inserts default roles into the database.
 *
 * up:   Adds ADMIN and USER roles to the 'roles' table.
 * down: (optional) Removes all entries from the 'roles' table.
 */
module.exports = {
  /**
   * Run the seeder to insert roles.
   * @param {object} queryInterface - The interface for database queries.
   * @param {object} Sequelize - The Sequelize library instance.
   */
  async up (queryInterface, Sequelize) {
    // Insert two roles: ADMIN and USER, each with a UUID and timestamps
    await queryInterface.bulkInsert("roles", [{
      uuid: "1e516945-88f2-4a90-9ef5-1546d0a0f863", // Unique identifier for ADMIN role
      name: "ADMIN", // Role name
      created_at: new Date(), // Timestamp for creation
      updated_at: new Date(), // Timestamp for last update
    }, {
      uuid: "a8e28554-8565-460b-9d33-f82bd26c859a", // Unique identifier for USER role
      name: "USER", // Role name
      created_at: new Date(), // Timestamp for creation
      updated_at: new Date(), // Timestamp for last update
    }], {});
  },

  /**
   * (Optional) Revert the seeder by deleting all roles.
   * @param {object} queryInterface - The interface for database queries.
   * @param {object} Sequelize - The Sequelize library instance.
   */
  async down (queryInterface, Sequelize) {
    // Uncomment the following line to enable role deletion on rollback
    // await queryInterface.bulkDelete("roles", null, {});
  }
};