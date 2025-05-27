// validateEnv.ts - Utility to validate environment variables using envalid
// Importing required validators from envalid
import { cleanEnv, port, str } from "envalid";

/**
 * Validates required environment variables for the application.
 *
 * Uses envalid's cleanEnv to ensure that process.env contains
 * the required variables with correct types. Throws an error if validation fails.
 *
 * - NODE_ENV: Must be a string (e.g., 'development', 'production')
 * - PORT: Must be a valid port number
 */
export function ValidateEnv() {
  // Validate process.env with required variables and types
  cleanEnv(process.env, {
    NODE_ENV: str(), // Environment type (string)
    PORT: port(),    // Application port (number)
  });
}