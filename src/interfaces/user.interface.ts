import { File } from "@interfaces/file.interface";

/**
 * User interface representing a user entity in the system.
 * @property {number} [pk] - Primary key (optional).
 * @property {string} [uuid] - Universally unique identifier (optional).
 * @property {string} [full_name] - Full name of the user (optional).
 * @property {number|string} [display_picture] - Display picture ID or URL (optional).
 * @property {string} email - Email address of the user (required).
 * @property {string} [password] - Password of the user (optional).
 * @property {Date} [email_verified_at] - Date when the email was verified (optional).
 * @property {File} [avatar] - Avatar file object (optional).
 */
export interface User {
  // Primary key (optional)
  pk?: number;
  // Universally unique identifier (optional)
  uuid?: string;
  // Full name of the user (optional)
  full_name?: string;
  // Display picture ID or URL (optional)
  display_picture?: number | string;
  // Email address (required)
  email: string;
  // Password (optional)
  password?: string;
  // Date when the email was verified (optional)
  email_verified_at?: Date;
  // Avatar file object (optional)
  avatar?: File;
}

/**
 * Query parameters for searching and paginating users.
 * @property {string} [page] - Page number (optional).
 * @property {string} [limit] - Number of items per page (optional).
 * @property {string} [search] - Search keyword (optional).
 * @property {string} [order] - Order by field (optional).
 * @property {string} [sort] - Sort direction (optional).
 */
export interface UserQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  order?: string;
  sort?: string;
}

/**
 * Parsed user data for response or processing.
 * @property {string} uuid - Universally unique identifier.
 * @property {string} [full_name] - Full name of the user (optional).
 * @property {number|string} [display_picture] - Display picture ID or URL (optional).
 * @property {string} email - Email address of the user.
 */
export interface UserParsed {
  uuid: string;
  full_name?: string;
  display_picture?: number | string;
  email: string;
}

/**
 * User response object omitting the password field.
 * Extends User interface without the password property.
 */
export interface UserResponse extends Omit<User, "password"> {}