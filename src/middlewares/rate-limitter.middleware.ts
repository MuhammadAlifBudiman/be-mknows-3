// Middleware for rate limiting using express-rate-limit
// Provides two rate limiter configurations: default and email verification

import {
  rateLimit, // express-rate-limit function to create a rate limiter middleware
  type RateLimitRequestHandler, // Type for the rate limiter middleware handler
} from "express-rate-limit"
import { RATE_DELAY, RATE_LIMIT } from "@config/index"; // Import rate limit config values
import { HttpExceptionTooManyRequests } from "@/exceptions/HttpException"; // Custom exception for 429 errors

/**
 * Limitter class provides rate limiting middleware for Express routes.
 * Includes default and email verification specific limiters.
 */
class Limitter {
  /**
   * Default rate limiter middleware.
   * Limits requests per IP based on RATE_DELAY and RATE_LIMIT from config.
   * Throws HttpExceptionTooManyRequests on limit exceeded.
   * @returns {RateLimitRequestHandler} Express middleware
   */
  public default = (): RateLimitRequestHandler => {
    const delay = Number(RATE_DELAY) * 60 * 1000; // Convert RATE_DELAY (minutes) to milliseconds

    return rateLimit({
      windowMs: delay, // Time window for rate limit
      max: Number(RATE_LIMIT), // Max requests per window per IP
      keyGenerator: (req) => req.ip, // Use IP address as key
      handler: () => {
        // Custom handler for when rate limit is exceeded
        throw new HttpExceptionTooManyRequests(
          [`Too many requests from this IP, please try again after ${RATE_DELAY} minutes`],
        );
      },
    });
  };

  /**
   * Email verification rate limiter middleware.
   * Allows max 3 requests per hour per IP.
   * Throws HttpExceptionTooManyRequests on limit exceeded.
   * @returns {RateLimitRequestHandler} Express middleware
   */
  public emailVerification = (): RateLimitRequestHandler => {
    const delay = 60 * 60 * 1000; // 1 hour in milliseconds

    return rateLimit({
      windowMs: delay, // Time window for rate limit
      max: 3, // Max 3 requests per window per IP
      keyGenerator: (req) => req.ip, // Use IP address as key
      handler: () => {
        // Custom handler for when rate limit is exceeded
        throw new HttpExceptionTooManyRequests(
          [`Too many requests from this IP, please try again after ${Math.ceil(delay / (60 * 1000))} minutes`],
        );
      },
    });
  };
}

export default Limitter; // Export Limitter class for use in other modules