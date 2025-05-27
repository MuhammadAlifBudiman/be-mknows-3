// Configuration loader for environment variables using dotenv
// Loads environment variables from a file based on NODE_ENV (e.g., .env.development.local)
import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

/**
 * Indicates if credentials are required (from env CREDENTIALS)
 * @type {boolean}
 */
export const CREDENTIALS = process.env.CREDENTIALS === "true";

/**
 * Destructured environment variables for application configuration
 * @property {string} NODE_ENV - Current environment (development, production, etc.)
 * @property {string} PORT - Port number for the server
 * @property {string} SECRET_KEY - Secret key for authentication
 * @property {string} LOG_FORMAT - Log format type
 * @property {string} LOG_DIR - Directory for log files
 * @property {string} ORIGIN - Allowed CORS origin
 */
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;

/**
 * Database connection environment variables
 * @property {string} DB_USER - Database username
 * @property {string} DB_PASSWORD - Database password
 * @property {string} DB_HOST - Database host
 * @property {string} DB_PORT - Database port
 * @property {string} DB_DATABASE - Database name
 */
export const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;

/**
 * Rate limiting configuration
 * @property {string} RATE_DELAY - Delay between requests
 * @property {string} RATE_LIMIT - Maximum number of requests
 */
export const { RATE_DELAY, RATE_LIMIT } = process.env; 

/**
 * Maximum file upload size
 * @property {string} MAX_SIZE_FILE_UPLOAD - Max upload size in bytes or MB
 */
export const { MAX_SIZE_FILE_UPLOAD } = process.env; 

/**
 * Google email integration credentials
 * @property {string} GOOGLE_EMAIL - Google email address
 * @property {string} GOOGLE_APP_PASSWORD - App password for Google email
 */
export const { GOOGLE_EMAIL, GOOGLE_APP_PASSWORD } = process.env;