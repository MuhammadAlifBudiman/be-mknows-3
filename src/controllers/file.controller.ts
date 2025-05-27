/**
 * FileController handles file upload, retrieval, and user file listing endpoints.
 * Uses dependency injection for FileService and async error handling.
 */
import fs from "fs"; // Node.js file system module
import path from "path"; // Node.js path module
import { Request, Response, NextFunction } from "express"; // Express types
import asyncHandler from "express-async-handler"; // Middleware for async error handling
import { Container } from "typedi"; // Dependency injection container

import { FileService } from "@services/files.service"; // Service for file operations
import { RequestWithUser } from "@interfaces/authentication/token.interface"; // Custom request type with user info

import { apiResponse } from "@utils/apiResponse"; // Utility for standard API responses
import { HttpException } from "@/exceptions/HttpException"; // Custom HTTP exception class

/**
 * Controller class for file-related endpoints.
 */
export class FileController {
  /**
   * FileService instance injected via typedi Container.
   */
  private file = Container.get(FileService);

  /**
   * Upload a single file for the authenticated user.
   * @route POST /files/upload
   * @access Private
   * @param req - Express request with user and file
   * @param res - Express response
   * @param next - Express next function
   */
  public uploadFile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const image = req.file as Express.Multer.File; // Uploaded file from Multer
    const user_id = req.user.pk as number; // Authenticated user's ID

    if(!image) throw new HttpException(false, 400, "File is required"); // Validate file presence

    const response = await this.file.uploadSingleFile(user_id, image); // Upload file via service
    res.status(201).json(apiResponse(201, "OK", "Upload Success", response)); // Respond with success
  });

  /**
   * Retrieve a file by its UUID and send it as a response.
   * @route GET /files/:file_id
   * @access Public or Private (depending on route protection)
   * @param req - Express request with file_id param
   * @param res - Express response
   * @param next - Express next function
   */
  public getFileWithUUID = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { file_id } = req.params; // File UUID from route params

    const file = await this.file.getFileWithUUID(file_id); // Get file metadata from service
    const filepath = path.join(process.cwd(), `./uploads/${file.name}`); // Build file path

    if (!file || !fs.existsSync(filepath)) {
      throw new HttpException(false, 400, "File is not found"); // File not found error
    }

    res.sendFile(filepath); // Send file as response
  });

  /**
   * Get all files uploaded by the authenticated user.
   * @route GET /files/mine
   * @access Private
   * @param req - Express request with user info
   * @param res - Express response
   * @param next - Express next function
   */
  public getFileMine = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user_id = req.user.pk as number; // Authenticated user's ID
    const response = await this.file.getUserFiles(user_id); // Get user's files from service

    res.status(200).json(apiResponse(200, "OK", "Get Files Success", response)); // Respond with file list
  });
}