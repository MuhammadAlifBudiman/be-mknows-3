/**
 * Represents a role in the system.
 * @property {number} pk - Primary key of the role.
 * @property {string} uuid - Universally unique identifier for the role.
 * @property {string} name - Name of the role.
 */
export interface Role {
  pk: number; // Primary key
  uuid: string; // Unique identifier
  name: string; // Role name
}

/**
 * Represents the association between a user and a role.
 * @property {Role} [role] - The role object (optional).
 * @property {number} user_id - The user's unique identifier.
 * @property {number} role_id - The role's unique identifier.
 */
export interface UserRole {
  role?: Role; // Optional role object
  user_id: number; // User's ID
  role_id: number; // Role's ID
}