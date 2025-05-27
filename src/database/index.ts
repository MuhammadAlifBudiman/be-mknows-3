/**
 * Database initialization and model registration using Sequelize ORM.
 *
 * This file sets up the Sequelize instance, authenticates the connection,
 * and registers all models for use throughout the application.
 */

// Import Sequelize constructor from sequelize package
import { Sequelize } from "sequelize";

// Import environment variable for current NODE_ENV
import { NODE_ENV } from "@config/index";

// Import custom logger utility
import { logger } from "@utils/logger";

// Import database configuration object
import config from "@config/database";
// Select the configuration for the current environment, fallback to development
const dbConfig = config[NODE_ENV] || config["development"];

// Import all Sequelize model definitions
import OTPModel from "@/models/otps.model";
import RoleModel from "@models/roles.model";
import FileModel from "@models/files.model";
import UserModel from "@models/users.model";
import UserRoleModel from "@models/users_roles.model";
import UserSessionModel from "@models/users_sessions.model";
import CategoryModel from "@models/categories.model";
import ArticleModel from "@models/articles.model";
import ArticleCategoryModel from "@models/articles_categories.model";

/**
 * Initialize Sequelize instance with database credentials and config.
 * @type {Sequelize}
 */
const sequelize = new Sequelize(
  dbConfig.database as string,
  dbConfig.username as string,
  dbConfig.password,
  dbConfig
);

// Authenticate the database connection and log the result
sequelize
  .authenticate()
  .then(() => logger.info(`=> Database Connected on ${NODE_ENV}`))
  .catch((e) => console.error(e));

/**
 * DB object containing all registered models and Sequelize instance.
 * @property {Model} OTPs - OTP model
 * @property {Model} Files - File model
 * @property {Model} Roles - Role model
 * @property {Model} Users - User model
 * @property {Model} UsersRoles - UserRole model
 * @property {Model} UsersSessions - UserSession model
 * @property {Model} Categories - Category model
 * @property {Model} Articles - Article model
 * @property {Model} ArticlesCategories - ArticleCategory model
 * @property {Sequelize} sequelize - Sequelize instance for raw queries
 * @property {SequelizeStatic} Sequelize - Sequelize library
 */
export const DB = {
  OTPs: OTPModel(sequelize),
  Files: FileModel(sequelize),
  Roles: RoleModel(sequelize),
  Users: UserModel(sequelize),
  UsersRoles: UserRoleModel(sequelize),
  UsersSessions: UserSessionModel(sequelize),
  Categories: CategoryModel(sequelize),
  Articles: ArticleModel(sequelize),
  ArticlesCategories: ArticleCategoryModel(sequelize),
  sequelize, // connection instance (RAW queries)
  Sequelize, // library
};