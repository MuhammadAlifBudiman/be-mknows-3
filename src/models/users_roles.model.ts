// users_roles.model.ts
// Sequelize model definition for the users_roles join table, representing the many-to-many relationship between users and roles.

import { Sequelize, DataTypes, Model } from "sequelize"; // Import Sequelize core classes
import { UserRole } from "@interfaces/authentication/user-role.interface"; // Import UserRole interface for type safety

import { RoleModel } from "@models/roles.model"; // Import RoleModel for associations
import { UserModel } from "@models/users.model"; // Import UserModel for associations

// Type alias for creation attributes, based on UserRole interface
export type UserRoleCreationAttributes = UserRole;

/**
 * Sequelize Model for users_roles join table.
 * Represents the association between a user and a role.
 * Implements the UserRole interface for type safety.
 */
export class UserRoleModel extends Model<UserRole, UserRoleCreationAttributes> implements UserRole {
  /**
   * The ID of the user associated with the role.
   */
  public user_id: number;
  /**
   * The ID of the role associated with the user.
   */
  public role_id: number;

  /**
   * Optional RoleModel instance (for eager loading).
   */
  public role?: RoleModel;

  /**
   * Timestamp when the record was created.
   */
  public readonly created_at!: Date;
  /**
   * Timestamp when the record was last updated.
   */
  public readonly updated_at!: Date;
  /**
   * Timestamp when the record was soft-deleted (if applicable).
   */
  public readonly deleted_at: Date;
}

/**
 * Initializes the UserRoleModel and sets up associations.
 * @param sequelize Sequelize instance
 * @returns The initialized UserRoleModel
 */
export default function (sequelize: Sequelize): typeof UserRoleModel {
  UserRoleModel.init(
    {
      // Foreign key: user_id (references users table)
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      // Foreign key: role_id (references roles table)
      role_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "users_roles", // Table name in the database
      timestamps: true, // Enable created_at and updated_at
      paranoid: true, // Enable soft deletes (deleted_at)
      sequelize, // Sequelize instance
    },
  );

  // Set up many-to-many association: UserModel <-> RoleModel through UserRoleModel
  UserModel.belongsToMany(RoleModel, { through: UserRoleModel, foreignKey: "user_id" });
  RoleModel.belongsToMany(UserModel, { through: UserRoleModel, foreignKey: "role_id" });

  // Set up one-to-many association: UserModel -> UserRoleModel
  UserModel.hasMany(UserRoleModel);
  UserRoleModel.belongsTo(UserModel);

  // Set up one-to-many association: RoleModel -> UserRoleModel
  RoleModel.hasMany(UserRoleModel);
  // Set up belongsTo association with alias for eager loading
  UserRoleModel.belongsTo(RoleModel, { foreignKey: "role_id", as: "role" });

  return UserRoleModel;
}