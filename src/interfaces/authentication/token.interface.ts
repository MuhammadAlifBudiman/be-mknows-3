// Interfaces for authentication token handling in the application.
//
// DataStoredInToken: Represents the data stored inside a JWT or similar token.
//   - sid: (optional) User session UUID, used to identify the session.
//   - uid: User UUID, uniquely identifies the user.
//   - iat: (optional) Issued at timestamp (seconds since epoch).
//   - exp: (optional) Expiration timestamp (seconds since epoch).
//
// TokenPayload: Structure for returning a token and its expiration info.
//   - token: The JWT or authentication token string.
//   - expiresIn: Number of seconds until the token expires.
//
// RequestWithUser: Extends Express Request to include authenticated user info.
//   - session_id: The current session's UUID.
//   - user: The authenticated user object.
//   - user_roles: Array of roles assigned to the user.

import { Request } from "express";
import { User } from "@interfaces/user.interface";

/**
 * Represents the data stored inside an authentication token (e.g., JWT).
 * @property {string} [sid] - User session UUID (optional).
 * @property {string} uid - User UUID.
 * @property {number} [iat] - Issued at timestamp (optional).
 * @property {number} [exp] - Expiration timestamp (optional).
 */
export interface DataStoredInToken {
  sid?: string; // user session uuid 
  uid: string; // user uuid
  iat?: number;
  exp?: number;
}

/**
 * Structure for returning a token and its expiration info.
 * @property {string} token - The authentication token string.
 * @property {number} expiresIn - Number of seconds until the token expires.
 */
export interface TokenPayload {
  token: string;
  expiresIn: number;
}

/**
 * Extends Express Request to include authenticated user and session info.
 * @property {string} session_id - The current session's UUID.
 * @property {User} user - The authenticated user object.
 * @property {string[]} user_roles - Array of roles assigned to the user.
 */
export interface RequestWithUser extends Request {
  session_id: string;
  user: User;
  user_roles: string[];
}