// roles.model.ts
// Sequelize model definition for the 'roles' table.
// This file defines the RoleModel class and its initialization function.

import { Sequelize, DataTypes, Model, Optional } from "sequelize"; // Import Sequelize core classes and types
import { Role } from "@interfaces/authentication/user-role.interface"; // Import Role interface for type safety

/**
 * Type for Role creation attributes.
 * Optional fields: pk (primary key), uuid (universally unique identifier)
 */
export type RoleCreationAttributes = Optional<Role, "pk" | "uuid">;

/**
 * Sequelize Model for the 'roles' table.
 * Implements the Role interface for type safety.
 */
export class RoleModel extends Model<Role, RoleCreationAttributes> implements Role {
  /**
   * Primary key (auto-incremented integer)
   */
  public pk: number;
  /**
   * Universally unique identifier (UUID)
   */
  public uuid: string;
  /**
   * Name of the role (e.g., 'admin', 'user')
   */
  public name: string;
  /**
   * Timestamp when the record was created
   */
  public readonly created_at!: Date;
  /**
   * Timestamp when the record was last updated
   */
  public readonly updated_at!: Date;
  /**
   * Timestamp when the record was deleted (for soft deletes)
   */
  public readonly deleted_at: Date;
}

/**
 * Initializes the RoleModel with Sequelize.
 * @param sequelize - Sequelize instance
 * @returns The initialized RoleModel
 */
export default function (sequelize: Sequelize): typeof RoleModel {
  RoleModel.init(
    {
      // Primary key: auto-incremented integer
      pk: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      // UUID: unique string identifier, default generated
      uuid: {
        allowNull: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.STRING(52),
        unique: true
      },
      // Name: unique string for the role name
      name: {
        allowNull: true,
        type: DataTypes.STRING(52),
        unique: true
      },
    },
    {
      tableName: "roles", // Table name in the database
      timestamps: true, // Enables created_at and updated_at
      paranoid: true, // Enables soft deletes (deleted_at)
      sequelize, // Sequelize instance
    },
  );

  return RoleModel;
}