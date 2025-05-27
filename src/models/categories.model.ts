// categories.model.ts
// Sequelize model definition for the Category entity.
// This file defines the CategoryModel class and its initialization function for Sequelize ORM.

import { Sequelize, DataTypes, Model, Optional } from "sequelize"; // Import Sequelize core classes and types

import { Category } from "@interfaces/category.interface"; // Import the Category interface for type safety

// Define the attributes required for creating a Category, making 'pk' and 'uuid' optional for creation
export type CategoryCreationAttributes = Optional<Category, "pk" | "uuid">;

/**
 * CategoryModel class
 * Extends Sequelize's Model class to represent the 'categories' table.
 * Implements the Category interface for type safety.
 */
export class CategoryModel extends Model<Category, CategoryCreationAttributes> implements Category {
  public pk: number; // Primary key (auto-incremented integer)
  public uuid: string; // Universally unique identifier (UUID)
  
  public name: string; // Name of the category
  public description: string; // Description of the category

  public readonly created_at!: Date; // Timestamp when the record was created
  public readonly updated_at!: Date; // Timestamp when the record was last updated
  public readonly deleted_at: Date; // Timestamp when the record was soft-deleted (paranoid mode)
}

/**
 * Initializes the CategoryModel with Sequelize.
 * @param sequelize - Sequelize instance
 * @returns The initialized CategoryModel
 */
export default function (sequelize: Sequelize): typeof CategoryModel {
  CategoryModel.init(
    {
      pk: {
        type: DataTypes.INTEGER, // Integer type for primary key
        primaryKey: true, // Set as primary key
        autoIncrement: true, // Auto-increment value
      },
      uuid: {
        type: DataTypes.UUID, // UUID type
        defaultValue: DataTypes.UUIDV4, // Default to UUID v4
      },
      name: {
        type: DataTypes.STRING, // String type for category name
        allowNull: false, // Name is required
      },
      description: {
        type: DataTypes.TEXT, // Text type for category description
        allowNull: false, // Description is required
      },
    },
    {
      tableName: "categories", // Table name in the database
      timestamps: true, // Enable createdAt and updatedAt fields
      paranoid: true, // Enable soft deletes (deletedAt field)
      sequelize // Pass the Sequelize instance
    },
  );

  return CategoryModel; // Return the initialized model
}