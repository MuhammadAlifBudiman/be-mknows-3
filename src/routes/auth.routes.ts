// auth.routes.ts - Authentication routes for the API

// Importing Router from express to define route handlers
import { Router } from "express";
// Importing the Routes interface for type safety
import { Routes } from "@interfaces/routes.interface";

// Importing the AuthController which contains authentication logic
import { AuthController } from "@controllers/auth.controller";

// Importing authentication and validation middlewares
import { AuthMiddleware } from "@middlewares/auth.middleware";
import { ValidationMiddleware } from "@middlewares/validation.middleware";

// Importing DTOs (Data Transfer Objects) for user creation and login validation
import { CreateUserDto, LoginUserDto } from "@dtos/users.dto";
// Importing rate limiter middleware for email verification
import Limitter from "@/middlewares/rate-limitter.middleware";

/**
 * AuthRoute class implements the Routes interface and defines authentication-related endpoints.
 */
export class AuthRoute implements Routes {
  /**
   * The base path for authentication routes.
   * @type {string}
   */
  public path = "auth";
  /**
   * Express router instance for defining route handlers.
   * @type {Router}
   */
  public router = Router();
  /**
   * Instance of AuthController to handle authentication logic.
   * @type {AuthController}
   */
  public auth = new AuthController();
  /**
   * Instance of Limitter for rate limiting certain endpoints.
   * @type {Limitter}
   */
  public limitter = new Limitter();

  /**
   * Constructor initializes the authentication routes.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Defines all authentication-related routes and their middlewares/controllers.
   * - POST /v1/auth/register: Register a new user (with validation)
   * - POST /v1/auth/login: Log in a user (with validation)
   * - POST /v1/auth/logout: Log out a user (requires authentication)
   * - POST /v1/auth/verify: Verify user email
   * - POST /v1/auth/email/resend: Resend verification email (rate-limited)
   */
  private initializeRoutes() {
    // Register route: validates request body using CreateUserDto
    this.router.post(`/v1/${this.path}/register`, ValidationMiddleware(CreateUserDto), this.auth.signUp);
    // Login route: validates request body using LoginUserDto
    this.router.post(`/v1/${this.path}/login`, ValidationMiddleware(LoginUserDto), this.auth.logIn);
    // Logout route: requires authentication middleware
    this.router.post(`/v1/${this.path}/logout`, AuthMiddleware, this.auth.logOut);

    // Email verification route
    this.router.post(`/v1/${this.path}/verify`, this.auth.verifyEmail);
    // Resend verification email route: rate-limited
    this.router.post(`/v1/${this.path}/email/resend`, this.limitter.emailVerification(), this.auth.resendVerifyEmail);
  }
}