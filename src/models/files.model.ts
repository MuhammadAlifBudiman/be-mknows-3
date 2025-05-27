// File model definition using Sequelize ORM for the 'files' table
// Imports Sequelize core classes and types
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

// Import the File interface for type safety
import { File } from "@interfaces/file.interface";

/**
 * FileCreationAttributes
 * Type for attributes required to create a File instance.
 * 'pk' and 'uuid' are optional during creation as they are auto-generated.
 */
export type FileCreationAttributes = Optional<File, "pk" | "uuid">;

/**
 * FileModel
 * Sequelize model class for the 'files' table.
 * Implements the File interface and supports creation attributes.
 */
export class FileModel extends Model<File, FileCreationAttributes> implements File {
  /**
   * Primary key (auto-incremented integer)
   */
  public pk: number;
  /**
   * Universally unique identifier (UUID)
   */
  public uuid: string;
  /**
   * Name of the file
   */
  public name: string;
  /**
   * ID of the user who owns the file
   */
  public user_id: number;
  /**
   * File type (e.g., 'pdf', 'jpg')
   */
  public type: string;
  /**
   * File size in bytes
   */
  public size: number;
  /**
   * Timestamp when the file was created (read-only)
   */
  public readonly created_at!: Date;
  /**
   * Timestamp when the file was last updated (read-only)
   */
  public readonly updated_at!: Date;
  /**
   * Timestamp when the file was deleted (for soft deletes)
   */
  public readonly deleted_at: Date;
}

/**
 * Initializes the FileModel with its schema and options.
 * @param sequelize Sequelize instance
 * @returns FileModel class
 */
export default function (sequelize: Sequelize): typeof FileModel {
  FileModel.init(
    {
      // Primary key: auto-incremented integer
      pk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // UUID: auto-generated unique identifier
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      // Foreign key: user ID (required)
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Uncomment and update references if UserModel is available
        // references: {
        //   model: UserModel,
        //   key: "pk",
        // },
        // onDelete: "CASCADE",
        // onUpdate: "CASCADE",
      },
      // File name (required)
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // File size in bytes (required)
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // File type (required)
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Table name in the database
      tableName: "files",
      // Enable createdAt and updatedAt timestamps
      timestamps: true,
      // Enable soft deletes (deletedAt)
      paranoid: true,
      // Sequelize instance
      sequelize
    },
  );

  // Return the initialized model
  return FileModel;
}