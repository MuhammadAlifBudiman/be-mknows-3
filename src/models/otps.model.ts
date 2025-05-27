// otps.model.ts - Sequelize model definition for OTPs
//
// This file defines the OTPModel class, which represents the 'otps' table in the database.
// It uses Sequelize ORM for model definition and management.

import { Sequelize, DataTypes, Model, Optional } from "sequelize"; // Import Sequelize core classes and types

import { OTP } from "@interfaces/otp.interface"; // Import OTP interface for type safety

// Define the type for OTP creation attributes, making 'pk' and 'uuid' optional during creation
export type OTPCreationAttributes = Optional<OTP, "pk" | "uuid">;

/**
 * OTPModel class
 * Extends Sequelize's Model class to represent the OTP entity.
 * Implements the OTP interface for type safety.
 *
 * Fields:
 *   - pk: Primary key (auto-increment integer)
 *   - uuid: Universally unique identifier (UUID)
 *   - user_id: Foreign key referencing the user
 *   - key: The OTP value
 *   - type: OTP type (e.g., FORGET_PASSWORD, EMAIL_VERIFICATION)
 *   - status: OTP status (e.g., AVAILABLE, USED, EXPIRED)
 *   - expired_at: Expiry date and time for the OTP
 *   - created_at: Timestamp when the OTP was created
 *   - updated_at: Timestamp when the OTP was last updated
 *   - deleted_at: Timestamp when the OTP was soft-deleted (paranoid mode)
 */
export class OTPModel extends Model<OTP, OTPCreationAttributes> implements OTP {
  public pk: number; // Primary key
  public uuid: string; // UUID for the OTP
  
  public user_id: number; // Associated user ID

  public key: string; // The OTP value
  public type: string; // OTP type
  public status: string; // OTP status

  public expired_at: Date; // Expiry date

  public readonly created_at!: Date; // Creation timestamp
  public readonly updated_at!: Date; // Update timestamp
  public readonly deleted_at: Date; // Deletion timestamp (for paranoid mode)
}

/**
 * Initializes the OTPModel with Sequelize.
 * @param sequelize - Sequelize instance
 * @returns OTPModel - The initialized model
 */
export default function (sequelize: Sequelize): typeof OTPModel {
  OTPModel.init(
    {
      pk: {
        type: DataTypes.INTEGER, // Integer type
        primaryKey: true, // Primary key
        autoIncrement: true, // Auto-increment
      },
      uuid: {
        type: DataTypes.UUID, // UUID type
        defaultValue: DataTypes.UUIDV4, // Default to UUID v4
      },
      user_id: {
        type: DataTypes.INTEGER, // Integer type
        allowNull: false, // Cannot be null
        // references: {
        //   model: UserModel, // Reference to UserModel (commented out)
        //   key: "pk",
        // },
        // onDelete: "CASCADE",
        // onUpdate: "CASCADE",
      },
      key: {
        type: DataTypes.STRING, // String type
        allowNull: false, // Cannot be null
      },
      type: {
        type: DataTypes.STRING, // String type
        allowNull: false, // Cannot be null
      },
      status: {
        type: DataTypes.STRING, // String type
        allowNull: false, // Cannot be null
      },
      expired_at: {
        type: DataTypes.DATE, // Date type
        allowNull: false, // Cannot be null
      },
    },
    {
      tableName: "otps", // Table name in the database
      timestamps: true, // Enable createdAt and updatedAt
      paranoid: true, // Enable soft deletes (deletedAt)
      sequelize // Sequelize instance
    },
  );

  return OTPModel; // Return the initialized model
}