// CategoryController handles all category-related HTTP requests.
// It uses dependency injection for the CategoryService and provides CRUD operations for categories.

import { Response, NextFunction } from "express"; // Express types for response and next middleware
import asyncHandler from "express-async-handler"; // Middleware to handle async errors
import { Container } from "typedi"; // Dependency injection container

import { RequestWithUser } from "@interfaces/authentication/token.interface"; // Custom request type with user info

import { CategoryService } from "@services/categories.service"; // Service for category business logic
import { Category } from "@interfaces/category.interface"; // Category interface

import { CreateCategoryDto, UpdateCategoryDto } from "@dtos/categories.dto"; // DTOs for category creation and update
import { apiResponse } from "@utils/apiResponse"; // Utility for standard API responses

/**
 * Controller class for Category endpoints.
 * Provides methods for getting, creating, updating, and deleting categories.
 */
export class CategoryController {
  /**
   * CategoryService instance injected via typedi Container.
   */
  private category = Container.get(CategoryService);

  /**
   * Get all categories.
   * Route: GET /categories
   * @param req Express request object (with user info)
   * @param res Express response object
   * @param next Express next middleware function
   * @returns JSON response with all categories
   */
  public getCategories = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const response: Category[] = await this.category.getCategories();
    res.status(200).json(apiResponse(200, "OK", "Get Category Success", response));
  });

  /**
   * Create a new category.
   * Route: POST /categories
   * @param req Express request object (with user info and body)
   * @param res Express response object
   * @param next Express next middleware function
   * @returns JSON response with created category
   */
  public createCategory = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const data: CreateCategoryDto = req.body;

    const response: Category = await this.category.createCategory(data);
    res.status(201).json(apiResponse(201, "OK", "Create Category Success", response));
  });

  /**
   * Update an existing category by ID.
   * Route: PUT /categories/:category_id
   * @param req Express request object (with user info, params, and body)
   * @param res Express response object
   * @param next Express next middleware function
   * @returns JSON response with updated category
   */
  public updateCategory = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { category_id } = req.params;
    const data: UpdateCategoryDto = req.body;

    const response: Category = await this.category.updateCategory(category_id, data);
    res.status(200).json(apiResponse(200, "OK", "Update Category Success", response));
  });

  /**
   * Delete a category by ID.
   * Route: DELETE /categories/:category_id
   * @param req Express request object (with user info and params)
   * @param res Express response object
   * @param next Express next middleware function
   * @returns JSON response indicating deletion success
   */
  public deleteCategory = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { category_id } = req.params;

    await this.category.deleteCategory(category_id);
    res.status(200).json(apiResponse(200, "OK", "Delete Category Success", {}));
  });
}