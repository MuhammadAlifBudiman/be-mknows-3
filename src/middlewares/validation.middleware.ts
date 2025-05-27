// validation.middleware.ts
// Middleware for validating request bodies using class-validator and class-transformer

import { NextFunction, Request, Response } from "express"; // Import Express types
import { plainToInstance } from "class-transformer"; // Import function to transform plain objects to class instances
import { validateOrReject, ValidationError } from "class-validator"; // Import validation functions and error type
import { HttpException } from "@exceptions/HttpException"; // Import custom HTTP exception class

/**
 * ValidationMiddleware
 * Middleware factory for validating request bodies against a DTO class.
 *
 * @param type - The DTO class to validate against
 * @param skipMissingProperties - If true, missing properties are not validated (default: false)
 * @param whitelist - If true, strips properties that do not have decorators (default: true)
 * @param forbidNonWhitelisted - If true, throws error on non-whitelisted properties (default: true)
 * @returns Express middleware function
 */
export const ValidationMiddleware = (
  type: any, // DTO class type
  skipMissingProperties = false, // Option to skip missing properties
  whitelist = true, // Option to remove non-decorated properties
  forbidNonWhitelisted = true // Option to throw error on non-whitelisted properties
) => {
  // Return the actual middleware function
  return (req: Request, res: Response, next: NextFunction) => {
    // Transform request body to instance of DTO class
    const dto = plainToInstance(type, req.body);
    // Validate the DTO instance
    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then(() => {
        // If valid, replace req.body with the validated DTO instance
        req.body = dto;
        next(); // Continue to next middleware
      })
      .catch((errors: ValidationError[]) => {
        // If validation fails, format error messages
        const messages = errors.map((error: ValidationError) => {
          // Handle empty field errors
          if(Object.values(error.constraints)[0].endsWith("be empty")) {
            return Object.values(error.constraints)[0]
              .split("_")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }

          // Handle non-whitelisted property errors
          if(Object.values(error.constraints)[0].endsWith("should not exist")) {
            return "Invalid Property"
          }

          // Handle UUID validation errors
          if(Object.values(error.constraints)[0].endsWith("be a UUID")) {
            return Object.values(error.constraints)[0]
              .split("_")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }

          // Handle character length errors
          if(Object.values(error.constraints)[0].includes("characters")) {
            return Object.values(error.constraints)[0]
              .split("_")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
          // Default: return the first constraint message
          return Object.values(error.constraints)[0];
        });
        // Pass formatted errors to the error handler
        next(new HttpException(false, 400, "Fields is required", messages));
      });
  };
};