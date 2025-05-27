// AuthController handles authentication-related endpoints such as sign up, login, logout, and email verification.
// It uses dependency injection for AuthService and utility functions for response formatting and user agent extraction.

import { NextFunction, Request, Response } from "express"; // Express types for request handling
import { Container } from "typedi"; // Dependency injection container
import asyncHandler from "express-async-handler"; // Middleware to handle async errors

import { AuthService } from "@services/auth.service"; // Service for authentication logic

import { User, UserResponse } from "@interfaces/user.interface"; // User interfaces
import { RequestWithUser } from "@interfaces/authentication/token.interface"; // Extended request with user info
import { UserAgent } from "@interfaces/common/useragent.interface"; // User agent interface

import { CreateUserDto } from "@dtos/users.dto"; // DTO for user creation

import { getUserAgent } from "@utils/userAgent"; // Utility to extract user agent
import { apiResponse } from "@utils/apiResponse"; // Utility to format API responses
import { HttpException } from "@exceptions/HttpException"; // Custom HTTP exception class

/**
 * AuthController class provides authentication endpoints:
 * - signUp: Register a new user
 * - logIn: Authenticate user and return tokens
 * - logOut: Invalidate user session
 * - verifyEmail: Verify user's email with OTP
 * - resendVerifyEmail: Resend email verification OTP
 */
export class AuthController {
  // Inject AuthService instance
  private auth = Container.get(AuthService);

  /**
   * Register a new user
   * @route POST /signup
   * @param req.body {CreateUserDto} - User registration data
   * @returns {UserResponse} - Registered user data
   */
  public signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body; // Extract user data from request body
    const signUpUserData: UserResponse = await this.auth.signup(userData); // Register user

    res.status(201).json(apiResponse(201, "OK", "Register Success", signUpUserData)); // Send response
  });

  /**
   * Authenticate user and return access token and cookie
   * @route POST /login
   * @param req.body {CreateUserDto} - User login data
   * @returns {access_token: string} - JWT access token
   * @sets Set-Cookie header for session
   */
  public logIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userAgentPayload: UserAgent = getUserAgent(req); // Extract user agent info
    const userData: CreateUserDto = req.body; // Extract login data
    
    const { cookie, accessToken } = await this.auth.login(userData, userAgentPayload); // Authenticate user

    res.setHeader("Set-Cookie", [cookie]); // Set session cookie
    res.status(200).json(apiResponse(200, "OK", "Login Success", { access_token: accessToken })); // Send response
  });

  /**
   * Log out the current user and invalidate session
   * @route POST /logout
   * @param req.user {User} - Authenticated user
   * @param req.session_id {string} - Session ID
   */
  public logOut = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: User = req.user; // Get user from request
    const userSessionId: string = req.session_id; // Get session ID

    await this.auth.logout(userData, userSessionId); // Invalidate session

    res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]); // Clear cookie
    res.status(200).json(apiResponse(200, "OK", "Logout Success", {})); // Send response
  });

  /**
   * Verify user's email using OTP
   * @route POST /verify-email
   * @param req.body {uuid, otp} - User UUID and OTP
   * @throws {HttpException} - If uuid or otp is missing
   * @returns {email: string} - Verified email
   */
  public verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { uuid, otp } = req.body; // Extract uuid and otp
    if(!uuid || !otp) throw new HttpException(false, 400, "UUID and OTP is required"); // Validate input

    const response = await this.auth.verifyEmail(uuid, otp); // Verify email
    res.status(200).json(apiResponse(200, "OK", "Email has been verified", {
      email: response.email
    })); // Send response
  });

  /**
   * Resend email verification OTP
   * @route POST /resend-verify-email
   * @param req.body {uuid} - User UUID
   * @throws {HttpException} - If uuid is missing
   * @returns {email: string} - Email to which OTP was sent
   */
  public resendVerifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { uuid } = req.body; // Extract uuid
    if(!uuid) throw new HttpException(false, 400, "UUID is required"); // Validate input

    const response = await this.auth.resendVerifyEmail(uuid); // Resend OTP
    res.status(200).json(apiResponse(200, "OK", "Verification email has been sent", {
      email: response.email
    })); // Send response
  });
}