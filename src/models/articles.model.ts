// articles.model.ts
// Sequelize model definition for the Article entity, including associations and attributes.

import { Sequelize, DataTypes, Model, Optional } from "sequelize"; // Sequelize ORM imports

import { User } from "@interfaces/user.interface"; // User interface
import { File } from "@interfaces/file.interface"; // File interface
import { Article } from "@interfaces/article.interface"; // Article interface
import { ArticleCategory } from "@interfaces/article.interface"; // ArticleCategory interface

import { UserModel } from "@models/users.model"; // User model
import { FileModel } from "@models/files.model"; // File model
import { CategoryModel } from '@models/categories.model'; // Category model
import { ArticleCategoryModel } from '@models/articles_categories.model'; // ArticleCategory model

/**
 * ArticleCreationAttributes
 * Type for attributes required to create an Article, omitting 'pk' and 'uuid' as they are auto-generated.
 */
export type ArticleCreationAttributes = Optional<Article, "pk" | "uuid">;

/**
 * ArticleModel
 * Sequelize model for the Article entity.
 * Implements Article interface and defines model attributes and associations.
 */
export class ArticleModel extends Model<Article, ArticleCreationAttributes> implements Article {
  /** Primary key (auto-incremented integer) */
  public pk: number;
  /** UUID (auto-generated) */
  public uuid: string;
  /** Article title */
  public title: string;
  /** Article description */
  public description: string;
  /** Article content (text) */
  public content: string;
  /** Foreign key to File (thumbnail) */
  public thumbnail_id: number;
  /** Foreign key to User (author) */
  public author_id: number;

  // Associations
  /** Associated File object for thumbnail */
  public readonly thumbnail: File;
  /** Associated User object for author */
  public readonly author: User;
  /** Associated categories (many-to-many) */
  public readonly categories: ArticleCategory[];

  /** Timestamps */
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at: Date;
}

/**
 * Initializes the ArticleModel with Sequelize, defines fields, options, and associations.
 * @param sequelize Sequelize instance
 * @returns ArticleModel
 */
export default function (sequelize: Sequelize): typeof ArticleModel {
  ArticleModel.init(
    {
      // Primary key
      pk: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // UUID (auto-generated)
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      // Article title
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Article description
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Article content
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // Foreign key to File (thumbnail)
      thumbnail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: FileModel,
        //   key: "pk",
        // },
        // onDelete: "CASCADE",
        // onUpdate: "CASCADE",
      },  
      // Foreign key to User (author)
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: UserModel,
        //   key: "pk",
        // },
        // onDelete: "CASCADE",
        // onUpdate: "CASCADE",
      },
    },
    {
      tableName: "articles", // Table name in DB
      timestamps: true, // Enables createdAt/updatedAt
      paranoid: true, // Enables soft deletes (deletedAt)
      sequelize, // Sequelize instance
      defaultScope: {
        // Default includes for queries
        include: [
          {
            attributes: ["uuid"],
            model: FileModel,
            as: "thumbnail",
          },
          {
            attributes: ["uuid", "full_name", "display_picture"],
            model: UserModel,
            as: "author",
            include: [
              {
                attributes: ["uuid"],
                model: FileModel,
                as: "avatar"
              }
            ]
          },
          {
            attributes: ["category_id"],
            model: ArticleCategoryModel,
            as: "categories",
            include: [{
              attributes: ["uuid", "name", "description"],
              model: CategoryModel, 
              as: "category"
            }]
          }
        ],
      }
    },
  );

  // Associations
  // FileModel has one ArticleModel as thumbnail
  FileModel.hasOne(ArticleModel, {
    foreignKey: "thumbnail_id",
    as: "thumbnail"
  });

  // ArticleModel belongs to FileModel as thumbnail
  ArticleModel.belongsTo(FileModel, {
    foreignKey: "thumbnail_id",
    as: "thumbnail"
  });

  // UserModel has many ArticleModel as author
  UserModel.hasMany(ArticleModel, {
    foreignKey: "author_id",
    as: "author"
  });

  // ArticleModel belongs to UserModel as author
  ArticleModel.belongsTo(UserModel, {
    foreignKey: "author_id",
    as: "author"
  });

  return ArticleModel;
}