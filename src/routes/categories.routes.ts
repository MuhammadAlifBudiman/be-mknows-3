// categories.routes.ts
// This file defines the routing for category-related endpoints using Express Router.
// It includes authentication and validation middlewares for protected routes.

import { Router } from "express"; // Import Express Router for route definitions
import { Routes } from "@interfaces/routes.interface"; // Import custom Routes interface

import { AuthMiddleware } from "@middlewares/auth.middleware"; // Middleware for authentication
import { ValidationMiddleware } from "@middlewares/validation.middleware"; // Middleware for request validation
import { CategoryController } from '@/controllers/category.controller'; // Controller for category logic
import { CreateCategoryDto, UpdateCategoryDto } from '@/dtos/categories.dto'; // DTOs for category creation and update

/**
 * CategoryRoute class implements the Routes interface.
 * It sets up all endpoints for category management (CRUD operations).
 */
export class CategoryRoute implements Routes {
  /**
   * The base path for all category routes.
   * @type {string}
   */
  public path = "categories";
  /**
   * The Express router instance for category routes.
   * @type {Router}
   */
  public router = Router();
  /**
   * The controller handling category business logic.
   * @type {CategoryController}
   */
  public controller = new CategoryController();

  /**
   * Constructor initializes the category routes.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Initializes all category-related routes with their respective middlewares and handlers.
   */
  private initializeRoutes() {
    // GET /v1/categories - Retrieve all categories
    this.router.get(`/v1/${this.path}`, this.controller.getCategories);
    // POST /v1/categories - Create a new category (requires authentication and validation)
    this.router.post(`/v1/${this.path}`, 
      AuthMiddleware, ValidationMiddleware(CreateCategoryDto), 
      this.controller.createCategory
    );
    // PUT /v1/categories/:category_id - Update a category by ID (requires authentication and validation)
    this.router.put(
      `/v1/${this.path}/:category_id`, 
      AuthMiddleware, ValidationMiddleware(UpdateCategoryDto), 
      this.controller.updateCategory
    );
    // DELETE /v1/categories/:category_id - Delete a category by ID (requires authentication)
    this.router.delete(
      `/v1/${this.path}/:category_id`,
      AuthMiddleware,
      this.controller.deleteCategory
    )
  }
}