// ArticleController handles all article-related HTTP requests, such as CRUD operations and queries.
// It uses dependency injection for the ArticleService and wraps all methods with asyncHandler for error handling.

import { Response, NextFunction } from "express"; // Express types for response and next middleware
import asyncHandler from "express-async-handler"; // Middleware to handle async errors
import { Container } from "typedi"; // Dependency injection container

import { Article, ArticleParsed, ArticleQueryParams } from "@interfaces/article.interface"; // Article-related interfaces
import { RequestWithUser } from "@interfaces/authentication/token.interface"; // Custom request type with user info
import { ArticleService } from "@services/articles.service"; // Service for article business logic

import { CreateArticleDto, UpdateArticleDto } from "@dtos/articles.dto"; // DTOs for article creation and update
import { apiResponse } from "@utils/apiResponse"; // Utility for consistent API responses

/**
 * Controller class for managing articles.
 * Provides endpoints for listing, retrieving, creating, updating, and deleting articles.
 */
export class ArticleController {
  /**
   * Injected ArticleService instance for business logic operations.
   */
  private article = Container.get(ArticleService);

  /**
   * Get a list of articles with optional query parameters (pagination, filters, etc).
   * @route GET /articles
   * @param req - Express request with user and query params
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getArticles = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const query: ArticleQueryParams = req.query; // Extract query params
    const response = await this.article.getArticles(query); // Fetch articles
    res.status(200).json(apiResponse(200, "OK", "Get Articles Success", response.articles, response.pagination));
  });

  /**
   * Get articles by category ID, with optional query parameters.
   * @route GET /articles/category/:category_id
   * @param req - Express request with user, params, and query
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getArticlesByCategory = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { category_id } = req.params; // Extract category ID from params
    const query: ArticleQueryParams = req.query; // Extract query params
    const response = await this.article.getArticlesByCategory(query, category_id); // Fetch articles by category
    res.status(200).json(apiResponse(200, "OK", "Get Articles Success", response.articles, response.pagination));
  });

  /**
   * Get a single article by its ID.
   * @route GET /articles/:article_id
   * @param req - Express request with user and params
   * @param res - Express response
   * @param next - Express next middleware
   */
  public getArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { article_id } = req.params; // Extract article ID from params
    const response: ArticleParsed = await this.article.getArticleById(article_id); // Fetch article
    res.status(200).json(apiResponse(200, "OK", "Get Article Success", response));
  });

  /**
   * Create a new article.
   * @route POST /articles
   * @param req - Express request with user and body
   * @param res - Express response
   * @param next - Express next middleware
   */
  public createArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number; // Get user ID from authenticated user
    const data: CreateArticleDto = req.body; // Get article data from request body

    const response: ArticleParsed = await this.article.createArticle(user_id, data); // Create article
    res.status(201).json(apiResponse(201, "OK", "Create Article Success", response));
  });

  /**
   * Update an existing article by its ID.
   * @route PUT /articles/:article_id
   * @param req - Express request with user, params, and body
   * @param res - Express response
   * @param next - Express next middleware
   */
  public updateArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { article_id } = req.params; // Extract article ID from params
    const user_id = req.user.pk as number; // Get user ID from authenticated user
    const data: UpdateArticleDto = req.body; // Get updated article data

    const response: ArticleParsed = await this.article.updateArticle(article_id, user_id, data); // Update article
    res.status(200).json(apiResponse(200, "OK", "Update Article Success", response));
  });

  /**
   * Delete an article by its ID.
   * @route DELETE /articles/:article_id
   * @param req - Express request with user and params
   * @param res - Express response
   * @param next - Express next middleware
   */
  public deleteArticle = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { article_id } = req.params; // Extract article ID from params
    const user_id = req.user.pk as number; // Get user ID from authenticated user

    await this.article.deleteArticle(article_id, user_id); // Delete article
    res.status(200).json(apiResponse(200, "OK", "Delete Article Success", {}));
  });
}