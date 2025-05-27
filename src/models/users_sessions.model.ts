// User session model definition for Sequelize ORM
// This file defines the UserSessionModel, which represents user session records in the database.

import { Sequelize, DataTypes, Model, Optional } from "sequelize"; // Sequelize ORM imports
import { UserSession } from "@interfaces/user-session.interface"; // UserSession interface definition

import { UserModel } from "@models/users.model"; // Import UserModel for association

// Type for creation attributes, making 'pk' and 'uuid' optional when creating a new session
export type UserSessionCreationAttributes = Optional<UserSession, "pk" | "uuid">;

/**
 * UserSessionModel class
 * Extends Sequelize's Model class to represent a user session record.
 * Implements UserSessionCreationAttributes for type safety.
 */
export class UserSessionModel extends Model<UserSession, UserSessionCreationAttributes> implements UserSessionCreationAttributes {
  /**
   * Primary key (auto-incremented integer)
   */
  public pk: number;
  /**
   * Universally unique identifier for the session
   */
  public uuid: string;
  /**
   * Foreign key referencing the user
   */
  public user_id: number;
  /**
   * User agent string from the session
   */
  public useragent: string;
  /**
   * IP address of the session
   */
  public ip_address: string;
  /**
   * Status of the session (e.g., "EXPIRED", "ACTIVE", "LOGOUT")
   */
  public status: string; // ["EXPIRED", "ACTIVE", "LOGOUT"]
  /**
   * Associated user instance (from UserModel)
   */
  public readonly user: UserModel;
  /**
   * Timestamp when the session was created
   */
  public readonly created_at!: Date;
  /**
   * Timestamp when the session was last updated
   */
  public readonly updated_at!: Date;
  /**
   * Timestamp when the session was deleted (for soft deletes)
   */
  public readonly deleted_at: Date;
}

/**
 * Initializes the UserSessionModel with Sequelize
 * @param sequelize Sequelize instance
 * @returns UserSessionModel class
 */
export default function (sequelize: Sequelize): typeof UserSessionModel {
  UserSessionModel.init(
    {
      // Primary key definition
      pk: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      // UUID for the session
      uuid: {
        allowNull: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.STRING(52),
      },
      // Foreign key to user
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER(),
      },
      // User agent string
      useragent: {
        allowNull: false,
        type: DataTypes.STRING(320),
      },
      // IP address
      ip_address: {
        allowNull: false,
        type: DataTypes.STRING(64),
      },
      // Session status
      status: {
        allowNull: false,
        type: DataTypes.STRING(512),
      },
    },
    {
      tableName: "users_sessions", // Table name in the database
      timestamps: true, // Enables createdAt and updatedAt fields
      paranoid: true, // Enables soft deletes (deletedAt field)
      sequelize, // Sequelize instance
    },
  );

  // Define association: UserSessionModel belongs to UserModel
  UserSessionModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user"
  });

  return UserSessionModel;
}