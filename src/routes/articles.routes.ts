// Article routes definition for Express.js API
// This file sets up all endpoints related to articles, including authentication and validation middleware.

import { Router } from "express"; // Express Router for defining routes
import { Routes } from "@interfaces/routes.interface"; // Interface for route classes

import { ArticleController } from "@controllers/article.controller"; // Controller for article logic
import { AuthMiddleware } from "@middlewares/auth.middleware"; // Middleware for authentication
import { ValidationMiddleware } from "@middlewares/validation.middleware"; // Middleware for request validation
import { CreateArticleDto, UpdateArticleDto } from "@dtos/articles.dto"; // DTOs for article creation and update

/**
 * ArticleRoute class
 * Implements the Routes interface to define all article-related endpoints.
 */
export class ArticleRoute implements Routes {
  /**
   * The base path for all article routes.
   * @type {string}
   */
  public path = "articles";
  /**
   * Express router instance for this route group.
   */
  public router = Router();
  /**
   * Controller instance to handle article logic.
   */
  public article = new ArticleController();

  /**
   * Constructor initializes all article routes.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Defines all endpoints for articles, including middleware and controllers.
   * - GET /v1/articles/categories/:category_id: Get articles by category
   * - GET /v1/articles: Get all articles
   * - GET /v1/articles/:article_id: Get a single article by ID
   * - POST /v1/articles: Create a new article (auth + validation)
   * - PUT /v1/articles/:article_id: Update an article (auth + validation)
   * - DELETE /v1/articles/:article_id: Delete an article (auth)
   */
  private initializeRoutes() {
    // Get articles by category
    this.router.get(`/v1/${this.path}/categories/:category_id`, this.article.getArticlesByCategory);
    // Get all articles
    this.router.get(`/v1/${this.path}`, this.article.getArticles);
    // Get a single article by ID
    this.router.get(`/v1/${this.path}/:article_id`, this.article.getArticle);
    // Create a new article (requires authentication and validation)
    this.router.post(`/v1/${this.path}`, 
      AuthMiddleware, ValidationMiddleware(CreateArticleDto), 
      this.article.createArticle
    );
    // Update an article (requires authentication and validation)
    this.router.put(
      `/v1/${this.path}/:article_id`, 
      AuthMiddleware, ValidationMiddleware(UpdateArticleDto), 
      this.article.updateArticle
    );
    // Delete an article (requires authentication)
    this.router.delete(
      `/v1/${this.path}/:article_id`,
      AuthMiddleware,
      this.article.deleteArticle
    )
  }
}