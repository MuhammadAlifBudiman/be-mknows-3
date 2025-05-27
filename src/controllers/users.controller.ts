/**
 * UserController handles all user-related HTTP requests.
 * Utilizes dependency injection via typedi Container for UserService.
 * Each method is wrapped with asyncHandler for error handling.
 */
import { NextFunction, Request, Response } from "express"; // Express types for request handling
import { Container } from "typedi"; // Dependency injection container
import asyncHandler from "express-async-handler"; // Middleware for handling async errors

import { User, UserQueryParams } from "@interfaces/user.interface"; // User interfaces
import { UserService } from "@services/users.service"; // User service for business logic
import { apiResponse } from "@/utils/apiResponse"; // Utility for standardized API responses
import { getUserAgent } from "@utils/userAgent"; // Utility to parse user agent from request
import { UserAgent } from "@/interfaces/common/useragent.interface"; // User agent interface
// import { CreateUserDto } from "@dtos/users.dto"; // DTO for user creation (commented out)

/**
 * Controller class for user endpoints.
 */
export class UserController {
  /**
   * Instance of UserService injected via typedi Container.
   */
  public user = Container.get(UserService);

  /**
   * Get user agent information from the request headers.
   * @route GET /useragent
   * @returns {UserAgent} Parsed user agent payload
   */
  public getUseragent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userAgentPayload: UserAgent = getUserAgent(req); // Parse user agent
    res.status(200).json(apiResponse(200, "OK", "All Users Retrieved", userAgentPayload)); // Respond with user agent info
  });

  /**
   * Get a list of users with optional query parameters for filtering/pagination.
   * @route GET /users
   * @param {UserQueryParams} req.query - Query parameters for filtering users
   * @returns {Object} List of users and pagination info
   */
  public getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const query: UserQueryParams = req.query; // Extract query params
    const response = await this.user.findAllUser(query); // Fetch users from service

    res.status(200).json(apiResponse(200, "OK", "All Users Retrieved", response.users, response.pagination)); // Respond with users and pagination
  });

  /**
   * Get a single user by their ID.
   * @route GET /users/:id
   * @param {number} req.params.id - User ID
   * @returns {User} The user data
   */
  public getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = Number(req.params.id); // Parse user ID from params
    const findOneUserData: User = await this.user.findUserById(userId); // Fetch user by ID

    res.status(200).json({ data: findOneUserData, message: "findOne" }); // Respond with user data
  });

  // /**
  //  * Create a new user.
  //  * @route POST /users
  //  * @param {CreateUserDto} req.body - New user data
  //  * @returns {User} The created user
  //  */
  // public createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  //   const userData: CreateUserDto = req.body;
  //   const createUserData: User = await this.user.createUser(userData);
  //
  //   res.status(201).json({ data: createUserData, message: "created" });
  // });

  // /**
  //  * Update an existing user by ID.
  //  * @route PUT /users/:id
  //  * @param {number} req.params.id - User ID
  //  * @param {CreateUserDto} req.body - Updated user data
  //  * @returns {User} The updated user
  //  */
  // public updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userId = Number(req.params.id);
  //     const userData: CreateUserDto = req.body;
  //     const updateUserData: User = await this.user.updateUser(userId, userData);
  //
  //     res.status(200).json({ data: updateUserData, message: "updated" });
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  // /**
  //  * Delete a user by ID.
  //  * @route DELETE /users/:id
  //  * @param {number} req.params.id - User ID
  //  * @returns {User} The deleted user
  //  */
  // public deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const userId = Number(req.params.id);
  //     const deleteUserData: User = await this.user.deleteUser(userId);
  //
  //     res.status(200).json({ data: deleteUserData, message: "deleted" });
  //   } catch (error) {
  //     next(error);
  //   }
  // });
}