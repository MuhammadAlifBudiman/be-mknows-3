// account.routes.ts - Defines routes for account-related operations
// Importing Router from express to create route handlers
import { Router } from "express";
// Importing the Routes interface for type safety
import { Routes } from "@interfaces/routes.interface";

// Importing the AccountController to handle account logic
import { AccountController } from "@controllers/account.controller";
// Importing AuthMiddleware to protect routes
import { AuthMiddleware } from "@middlewares/auth.middleware";
// Importing ValidationMiddleware for validating request bodies
import { ValidationMiddleware } from "@middlewares/validation.middleware";
// Importing DTO for updating user profile
import { UpdateUserProfileDto } from "@dtos/account.dto";

/**
 * AccountRoute class implements the Routes interface.
 * Sets up all account-related endpoints and attaches middlewares/controllers.
 */
export class AccountRoute implements Routes {
  /**
   * The base path for all account routes.
   * @type {string}
   */
  public path = "account";
  /**
   * The Express router instance for account routes.
   * @type {Router}
   */
  public router = Router();
  /**
   * The controller instance handling account logic.
   * @type {AccountController}
   */
  public account = new AccountController();

  /**
   * Initializes the account routes upon class instantiation.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Defines all account-related endpoints and attaches middlewares/controllers.
   * - GET /v1/account/profile/me: Get current user's profile (requires authentication)
   * - GET /v1/account/sessions/me: Get current user's session history (requires authentication)
   * - PUT /v1/account/profile/me: Update current user's profile (requires authentication and validation)
   */
  private initializeRoutes() {
    // Route to get the current user's profile
    this.router.get(`/v1/${this.path}/profile/me`, AuthMiddleware, this.account.getMyProfile);
    // Route to get the current user's session histories
    this.router.get(`/v1/${this.path}/sessions/me`, AuthMiddleware, this.account.getMySessionsHistories);
    // Route to update the current user's profile with validation
    this.router.put(`/v1/${this.path}/profile/me`, AuthMiddleware, ValidationMiddleware(UpdateUserProfileDto), this.account.updateMyProfile);
  }
}