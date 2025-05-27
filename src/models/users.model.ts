// users.model.ts - Sequelize model definition for User entity
// Import necessary modules from sequelize and interfaces
import { Sequelize, DataTypes, Model, Optional } from "sequelize"; // Sequelize ORM core classes and types
import { User } from "@interfaces/user.interface"; // User interface definition

import { FileModel } from "@models/files.model"; // File model for avatar relation
import { UserRole } from '@interfaces/authentication/user-role.interface'; // UserRole interface (not used directly here)

// Define the attributes required for creating a User, making some fields optional
export type UserCreationAttributes = Optional<User, "pk" | "uuid" | "full_name" | "display_picture">;

/**
 * UserModel class - Sequelize model for the 'users' table
 * Extends Sequelize's Model class and implements the User interface
 */
export class UserModel extends Model<User, UserCreationAttributes> implements User {
  /**
   * Primary key (auto-incremented integer)
   */
  public pk: number;
  /**
   * Universally unique identifier for the user
   */
  public uuid: string;
  /**
   * Full name of the user (nullable)
   */
  public full_name: string;
  /**
   * Foreign key to the user's display picture (nullable, references FileModel)
   */
  public display_picture: number;
  /**
   * User's email address (unique, required)
   */
  public email: string;
  /**
   * User's hashed password (required)
   */
  public password: string;
  /**
   * Timestamp when the user's email was verified (nullable)
   */
  public email_verified_at: Date;
  /**
   * Timestamp when the user was created (managed by Sequelize)
   */
  public readonly created_at!: Date;
  /**
   * Timestamp when the user was last updated (managed by Sequelize)
   */
  public readonly updated_at!: Date;
  /**
   * Timestamp when the user was soft-deleted (managed by Sequelize, nullable)
   */
  public readonly deleted_at: Date;
}

/**
 * Initializes the UserModel with its schema and associations
 * @param sequelize Sequelize instance
 * @returns UserModel class
 */
export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      // Primary key definition
      pk: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // UUID field with default value
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      // Full name (nullable)
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // Display picture (nullable, foreign key to FileModel)
      display_picture: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: {
        //   model: FileModel,
        //   key: "pk",
        // },
        // onDelete: "CASCADE",
        // onUpdate: "CASCADE",
      },
      // Email (required)
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      // Password (required)
      password: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      // Email verification timestamp (nullable)
      email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: "users", // Table name in the database
      timestamps: true, // Enable created_at and updated_at
      paranoid: true, // Enable soft deletes (deleted_at)
      sequelize, // Sequelize instance
      defaultScope: {
        attributes: { exclude: ["password"] }, // Exclude password by default
      },
    },
  );

  // Association: FileModel hasOne UserModel (avatar)
  FileModel.hasOne(UserModel, {
    foreignKey: "display_picture",
    as: "avatar"
  });

  // Association: UserModel belongsTo FileModel (avatar)
  UserModel.belongsTo(FileModel, {
    foreignKey: "display_picture",
    as: "avatar"
  });

  return UserModel;
}