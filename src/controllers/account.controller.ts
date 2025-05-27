// AccountController handles user account-related endpoints.
// It uses dependency injection for AccountService and provides methods for profile and session management.

import { Response, NextFunction } from "express"; // Express types for response and next middleware
import asyncHandler from "express-async-handler"; // Middleware to handle async errors
import { Container } from "typedi"; // Dependency injection container

import { User } from "@interfaces/user.interface"; // User entity interface
import { UserSession } from "@interfaces/user-session.interface"; // User session entity interface
import { RequestWithUser } from "@interfaces/authentication/token.interface"; // Custom request type with user info
import { UpdateUserProfileDto } from "@dtos/account.dto"; // DTO for updating user profile

import { AccountService } from "@services/account.service"; // Service for account logic
import { apiResponse } from "@utils/apiResponse"; // Utility for standard API responses

/**
 * Controller for account-related operations.
 */
export class AccountController {
  /**
   * AccountService instance injected via typedi Container.
   */
  private account = Container.get(AccountService);

  /**
   * Get the profile of the currently authenticated user.
   * @route GET /account/profile
   * @access Private
   * @returns {User} User profile data
   */
  public getMyProfile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number; // Extract user ID from request
    const user: User = await this.account.getProfileByUserId(user_id); // Fetch user profile

    res.status(200).json(apiResponse(200, "OK", "Get Profile Success", user)); // Send response
  });

  /**
   * Get session history for the currently authenticated user.
   * @route GET /account/sessions
   * @access Private
   * @returns {UserSession[]} List of user session histories
   */
  public getMySessionsHistories = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number; // Extract user ID
    const session_id = req.session_id; // Current session ID
    const userSessions: UserSession[] = await this.account.getSessionsHistoriesByUserId(user_id, session_id); // Fetch session histories

    res.status(200).json(apiResponse(200, "OK", "Get Sessions Histories Success", userSessions)); // Send response
  });

  /**
   * Update the profile of the currently authenticated user.
   * @route PUT /account/profile
   * @access Private
   * @param {UpdateUserProfileDto} updatedProfile - New profile data
   * @returns {User} Updated user profile
   */
  public updateMyProfile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number; // Extract user ID
    const updatedProfile: UpdateUserProfileDto = req.body; // Get updated profile data from request body

    const user: User = await this.account.updateUserProfile(user_id, updatedProfile); // Update user profile

    res.status(200).json(apiResponse(200, "OK", "Get Profile Success", user)); // Send response
  });
}