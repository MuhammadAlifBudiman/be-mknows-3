// users.routes.ts - Defines user-related API routes for the Express application
//
// This file sets up the routing for user operations, including authentication, authorization,
// and rate limiting. It uses controllers and middlewares to handle requests and responses.

import { Router } from "express"; // Express Router for defining routes
import { Routes } from "@interfaces/routes.interface"; // Interface for route structure

import { UserController } from "@controllers/users.controller"; // Controller for user logic
import { AuthMiddleware, AuthorizedRoles } from "@middlewares/auth.middleware"; // Auth middlewares
import Limitter from "@middlewares/rate-limitter.middleware"; // Rate limiting middleware
// import { ValidationMiddleware } from "@middlewares/validation.middleware"; // (Commented) Validation middleware
// import { CreateUserDto } from "@dtos/users.dto"; // (Commented) DTO for user creation

/**
 * UserRoute class implements the Routes interface for user-related endpoints.
 * - path: Base path for user routes
 * - router: Express router instance
 * - user: Instance of UserController to handle user logic
 * - limitter: Instance of Limitter for rate limiting
 */
export class UserRoute implements Routes {
  public path = "users"; // Base path for user routes
  public router = Router(); // Express router instance
  public user = new UserController(); // User controller instance
  public limitter = new Limitter(); // Rate limiter instance

  /**
   * Constructor initializes the user routes.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * initializeRoutes sets up all user-related API endpoints:
   * - GET /v1/users/check: Returns user agent info
   * - GET /v1/users: Returns all users (admin only, rate-limited)
   * - GET /v1/users/:id: Returns user by ID
   * (Commented) - POST, PUT, DELETE endpoints for user management
   */
  private initializeRoutes() {
    this.router.get(`/v1/users/check`, this.user.getUseragent); // Get user agent info
    this.router.get(`/v1/${this.path}`, 
      this.limitter.default(), // Apply rate limiting
      AuthMiddleware, // Require authentication
      AuthorizedRoles(["ADMIN"]), // Require ADMIN role
      this.user.getUsers // Controller: get all users
    );
    this.router.get(`/v1/${this.path}/:id`, this.user.getUserById); // Get user by ID
    // this.router.post(`/v1/${this.path}`, ValidationMiddleware(CreateUserDto), this.user.createUser); // (Commented) Create user
    // this.router.put(`/v1/${this.path}/:id`, ValidationMiddleware(CreateUserDto, true), this.user.updateUser); // (Commented) Update user
    // this.router.delete(`/v1/${this.path}/:id`, this.user.deleteUser); // (Commented) Delete user
  }
}