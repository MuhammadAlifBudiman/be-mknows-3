// File routes for handling file-related endpoints
// Importing Router from express for route definitions
import { Router } from "express";
// Importing Routes interface for type safety
import { Routes } from "@interfaces/routes.interface";

// Importing the FileController which contains the business logic for file operations
import { FileController } from "@controllers/file.controller";

// Importing authentication middleware to protect routes
import { AuthMiddleware } from "@middlewares/auth.middleware";
// Importing file upload middleware for handling file uploads
import { uploadFile } from "@middlewares/file-uploader.middleware";

/**
 * FileRoute class implements the Routes interface and defines endpoints for file operations.
 */
export class FileRoute implements Routes {
  /**
   * The base path for all file-related routes.
   * @type {string}
   */
  public path = "files";
  /**
   * The Express router instance for defining routes.
   * @type {Router}
   */
  public router = Router();
  /**
   * The controller instance for handling file logic.
   * @type {FileController}
   */
  public file = new FileController();

  /**
   * Initializes the routes when the class is instantiated.
   */
  constructor() {
    this.initializeRoutes();
  }

  /**
   * Defines all file-related routes and their middleware.
   * - POST /v1/files/upload: Upload a file (requires authentication)
   * - GET /v1/files/:file_id/preview: Preview a file by UUID (requires authentication)
   * - GET /v1/files/mine: Get files owned by the authenticated user
   */
  private initializeRoutes() {
    // Route for uploading a file. Uses AuthMiddleware and uploadFile middleware.
    this.router.post(
      `/v1/${this.path}/upload`, 
      AuthMiddleware,
      uploadFile.single("file"), 
      this.file.uploadFile
    );
    // Route for previewing a file by its UUID. Uses AuthMiddleware.
    this.router.get(
      `/v1/${this.path}/:file_id/preview`, 
      AuthMiddleware, 
      this.file.getFileWithUUID
    );
    // Route for getting files owned by the authenticated user. Uses AuthMiddleware.
    this.router.get(
      `/v1/${this.path}/mine`, 
      AuthMiddleware, 
      this.file.getFileMine
    );
  }
}