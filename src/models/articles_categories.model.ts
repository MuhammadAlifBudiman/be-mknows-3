// Model definition for the articles_categories join table in Sequelize
import { Sequelize, DataTypes, Model } from "sequelize"; // Import Sequelize core classes

import { ArticleModel } from "@models/articles.model"; // Import Article model
import { CategoryModel } from "@models/categories.model"; // Import Category model

import { ArticleCategory } from "@interfaces/article.interface"; // Import ArticleCategory interface

// Type alias for creation attributes
export type ArticleCategoryCreationAttributes = ArticleCategory;

/**
 * Sequelize model for the articles_categories join table.
 * Represents the many-to-many relationship between articles and categories.
 */
export class ArticleCategoryModel extends Model<ArticleCategory, ArticleCategoryCreationAttributes> implements ArticleCategory {
  /**
   * Foreign key referencing the article
   */
  public article_id: number;
  /**
   * Foreign key referencing the category
   */
  public category_id: number;

  /**
   * Timestamp when the record was created
   */
  public readonly created_at!: Date;
  /**
   * Timestamp when the record was last updated
   */
  public readonly updated_at!: Date;
  /**
   * Timestamp when the record was soft-deleted (if applicable)
   */
  public readonly deleted_at: Date;
}

/**
 * Initializes the ArticleCategoryModel and sets up associations.
 * @param sequelize Sequelize instance
 * @returns The initialized ArticleCategoryModel
 */
export default function (sequelize: Sequelize): typeof ArticleCategoryModel {
  // Initialize the model with its fields and options
  ArticleCategoryModel.init(
    {
      article_id: {
        allowNull: false, // Article ID must be provided
        type: DataTypes.INTEGER, // Integer type
      },
      category_id: {
        allowNull: false, // Category ID must be provided
        type: DataTypes.INTEGER, // Integer type
      },
    },
    {
      tableName: "articles_categories", // Table name in the database
      timestamps: true, // Enable created_at and updated_at
      paranoid: true, // Enable soft deletes (deleted_at)
      sequelize, // Sequelize instance
    },
  );

  // Set up many-to-many relationship between Article and Category through ArticleCategory
  ArticleModel.belongsToMany(CategoryModel, { through: ArticleCategoryModel, foreignKey: "article_id" });
  CategoryModel.belongsToMany(ArticleModel, { through: ArticleCategoryModel, foreignKey: "category_id" });

  // Set up one-to-many relationship for eager loading and association access
  ArticleModel.hasMany(ArticleCategoryModel, { foreignKey: "article_id", as: "categories" });
  ArticleCategoryModel.belongsTo(ArticleModel, { foreignKey: "article_id", as: "article" });

  CategoryModel.hasMany(ArticleCategoryModel, { foreignKey: "category_id", as: "category" });
  ArticleCategoryModel.belongsTo(CategoryModel, { foreignKey: "category_id", as: "category" });

  return ArticleCategoryModel;
}