// server.ts - Main entry point for the backend server
// This file initializes environment variables, sets up API routes, and starts the server.

// Import the main App class which configures the Express application
import { App } from "@/app";
// Import environment variable validation utility
import { ValidateEnv } from "@utils/validateEnv";

// Import route modules for different API endpoints
import { AuthRoute } from "@routes/auth.routes"; // Handles authentication endpoints
import { UserRoute } from "@routes/users.routes"; // Handles user management endpoints
import { AccountRoute } from "@routes/account.routes"; // Handles account-related endpoints
import { FileRoute } from "@routes/files.routes"; // Handles file upload/download endpoints
import { CategoryRoute } from "@routes/categories.routes"; // Handles category management endpoints
import { ArticleRoute } from "@routes/articles.routes"; // Handles article management endpoints

// Validate required environment variables before starting the server
ValidateEnv();

// Initialize the App with all route modules
const app = new App([
  new AuthRoute(),      // Authentication routes
  new UserRoute(),      // User management routes
  new AccountRoute(),   // Account management routes
  new FileRoute(),      // File handling routes
  new CategoryRoute(),  // Category management routes
  new ArticleRoute(),   // Article management routes
]);

// Start the server and listen for incoming requests
app.listen();