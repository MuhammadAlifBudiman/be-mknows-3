/**
 * Middleware for authentication and authorization in Express.js.
 * Handles JWT verification, session validation, and role-based access control.
 */

// Import necessary types from Express
import { Request, Response, NextFunction } from "express";
// Import JWT verification function
import { verify } from "jsonwebtoken";

// Import application secret key
import { SECRET_KEY } from "@config/index";
// Import custom HTTP exception class
import { HttpException } from "@exceptions/HttpException";

// Import user role and session interfaces
import { UserRole } from "@interfaces/authentication/user-role.interface";
import { UserSession } from "@interfaces/user-session.interface";
import { UserAgent } from "@interfaces/common/useragent.interface";
import { DataStoredInToken, RequestWithUser } from "@interfaces/authentication/token.interface";

// Import authentication service and user agent utility
import { AuthService } from "@services/auth.service";
import { getUserAgent } from "@utils/userAgent";

/**
 * Helper function to extract the Authorization token from cookies or headers.
 * @param req Express request object
 * @returns {string | null} The JWT token if present, otherwise null
 */
const getAuthorization = (req: Request) => {
  // Try to get token from cookies
  const coockie = req.cookies["Authorization"];
  if (coockie) return coockie;

  // Try to get token from Authorization header
  const header = req.header("Authorization");
  if (header) return header.split("Bearer ")[1];

  // Return null if not found
  return null;
};

/**
 * Middleware factory to restrict access to users with specific roles.
 * @param roles Array of allowed role names
 * @returns Express middleware function
 */
export const AuthorizedRoles = (roles: string[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    // Get user roles from request
    const userRoles = req.user_roles;
    // Check if user has at least one required role
    const hasRequiredRole = roles.some(requiredRole => userRoles.includes(requiredRole));

    if (hasRequiredRole) {
      // User authorized
      next();
    } else {
      // User not authorized
      next(new HttpException(false, 403, "Unauthorized Access #37"));
    }
  };
};

/**
 * Main authentication middleware.
 * - Verifies JWT token
 * - Checks user session and user agent
 * - Attaches user and roles to request object
 * @param req Express request object (extended with user/session info)
 * @param res Express response object
 * @param next Express next function
 */
export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    // Initialize AuthService
    const auth = new AuthService();
    // Extract JWT token
    const Authorization: string = getAuthorization(req);
    // Extract user agent info
    const userAgentPayload: UserAgent = getUserAgent(req);

    if (Authorization) {
      // Verify JWT and extract payload
      const { uid, sid } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      // Check if session is active
      const userSession: UserSession = await auth.checkSessionActive(sid);
      // Get user roles
      const userRoles: UserRole[] = await auth.getUserRoles(userSession.user.pk);

      // Validate user ID from session matches token
      if (userSession?.user?.uuid === uid) {
        // Validate user agent matches session
        if(userAgentPayload.source === userSession.useragent) {
          // Attach session and user info to request
          req.session_id = sid;
          req.user = userSession.user;
          req.user_roles = userRoles.map(userRole => userRole.role.name);

          next();
        } else {
          // User agent mismatch
          next(new HttpException(false, 401, "Invalid Token #60"));
        }
      } else {
        // User ID mismatch
        next(new HttpException(false, 401, "Invalid Token #63"));
      }
    } else {
      // No token provided
      next(new HttpException(false, 401, "Invalid Token #66"));
    }
  } catch (error) {
    // Any error in authentication
    next(new HttpException(false, 401, "Invalid Token #70"));
  }
};