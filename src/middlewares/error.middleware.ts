// Error handling middleware for Express.js applications
// Handles all errors thrown in the application and sends a formatted response
import { NextFunction, Request, Response } from "express"; // Import Express types
import { HttpException } from "@exceptions/HttpException"; // Custom HttpException class
import { logger } from "@utils/logger"; // Logger utility

/**
 * Express error handling middleware.
 * @function ErrorMiddleware
 * @param {HttpException} error - The error object, expected to be an instance of HttpException.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 *
 * Handles different error cases and sends a JSON response with appropriate status and message.
 * Logs the error details using the logger utility.
 */
export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract status, message, and errors from the error object, with defaults
    const status: number = error.status || 500;
    const message: string = error.message || "Something went wrong";
    const errors: string[] = error.errors || [];
    // const success: boolean = error.success || false; // (Unused)

    // Handle specific error message cases for custom responses
    if(message.endsWith("does not exist")) {
      // Log and respond for missing property errors
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
      res.status(400).json({ code: 400, status: "BAD REQUEST", message: "Invalid Property", errors });
    } else if(message.startsWith("invalid input syntax for")) {
      // Log and respond for invalid UUID errors
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
      res.status(400).json({ code: 400, status: "BAD REQUEST", message: "Invalid UUID", errors });
    } else {
      // Log and respond for all other errors
      logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
      res.status(status).json({ code: status, status: "BAD REQUEST", message, errors });
    }
  } catch (error) {
    // Pass any unexpected errors to the next error handler
    next(error);
  }
};