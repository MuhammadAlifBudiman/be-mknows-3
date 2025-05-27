/**
 * Main application class for initializing and configuring the Express server.
 * Includes middleware setup, database connection, route registration, and error handling.
 */
import "reflect-metadata"; // Enables TypeScript decorators and metadata reflection
import compression from "compression"; // Middleware for gzip compression
import cookieParser from "cookie-parser"; // Middleware for parsing cookies
import cors from "cors"; // Middleware for enabling Cross-Origin Resource Sharing
import express from "express"; // Express framework
import helmet from "helmet"; // Middleware for securing HTTP headers
import hpp from "hpp"; // Middleware to protect against HTTP Parameter Pollution
import morgan from "morgan"; // HTTP request logger middleware
import userAgent from "express-useragent"; // Middleware to parse user-agent header
import requestIp from "request-ip"; // Middleware to get client IP address

// Import environment variables and configuration
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from "@config/index";
import { DB } from "@database";
import { Routes } from "@interfaces/routes.interface";
import { ErrorMiddleware } from "@middlewares/error.middleware";
import RateLimitter from "@middlewares/rate-limitter.middleware";
import { logger, stream } from "@utils/logger";

/**
 * App class encapsulates the Express application and its configuration.
 */
export class App {
  /** Express application instance */
  public app: express.Application;
  /** Rate limiter instance */
  public limit = new RateLimitter();

  /** Application environment (development, production, etc.) */
  private readonly env: string;
  /** Application port */
  private readonly port: string | number;

  /**
   * Constructs the App instance, initializes all core components.
   * @param routes Array of route definitions implementing the Routes interface
   */
  constructor(routes: Routes[]) {
    this.app = express(); // Create Express app instance
    this.env = NODE_ENV || "development"; // Set environment
    this.port = PORT || 3000; // Set port

    this.connectToDatabase(); // Connect to the database
    this.initializeRateLimitter(); // Set up rate limiting
    this.initializeMiddlewares(); // Register global middlewares
    this.initializeRoutes(routes); // Register application routes
    this.initializeErrorHandling(); // Register error handling middleware
  }

  /**
   * Starts the Express server and logs environment and port information.
   */
  public listen() {
    this.app.listen(this.port, () => {
      logger.info("=================================");
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
    });
  }

  /**
   * Returns the Express application instance (useful for testing).
   */
  public getServer() {
    return this.app;
  }

  /**
   * Connects to the database using Sequelize ORM.
   * Uses sync with alter:true to update schema without dropping tables.
   */
  private async connectToDatabase() {
    await DB.sequelize.sync({ alter: true, force: false });
  }

  /**
   * Registers all global middlewares for security, parsing, logging, etc.
   */
  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream })); // HTTP request logging
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS })); // CORS setup
    this.app.use(hpp()); // Prevent HTTP Parameter Pollution
    this.app.use(helmet()); // Secure HTTP headers
    this.app.use(compression()); // Enable gzip compression
    this.app.use(express.json({ limit: "200mb", type: "application/json" })) // Parse JSON bodies
    this.app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    this.app.use(cookieParser()); // Parse cookies
    this.app.use(requestIp.mw()); // Get client IP address
    this.app.use(userAgent.express()); // Parse user-agent header
  }

  /**
   * Registers all application routes.
   * @param routes Array of route definitions
   */
  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use("/", route.router); // Mount each route at root path
    });
  }

  /**
   * Registers the global error handling middleware.
   */
  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

  /**
   * Registers the rate limiter middleware.
   */
  private initializeRateLimitter() {
    this.app.use(this.limit.default());
  }
}