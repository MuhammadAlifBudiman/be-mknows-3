// logger.ts - Winston logger configuration with daily rotate file
// ---------------------------------------------------------------
// This file sets up a logger using Winston and winston-daily-rotate-file.
// It creates separate log files for debug and error levels, rotates them daily,
// and also outputs logs to the console with colorization.

// Import required modules from Node.js and third-party libraries
import { existsSync, mkdirSync } from "fs"; // File system utilities
import { join } from "path"; // Path utility for directory paths
import winston from "winston"; // Winston logging library
import winstonDaily from "winston-daily-rotate-file"; // Daily rotate file transport for Winston
import { LOG_DIR } from "@config/index"; // Import log directory from config

// logs dir
const logDir: string = join(__dirname, LOG_DIR); // Absolute path to log directory

// Create log directory if it does not exist
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

// Define log format: [timestamp] [level]: message
const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  // Combine timestamp and custom log format
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat,
  ),
  transports: [
    // debug log setting: writes debug and above logs to daily rotated files
    new winstonDaily({
      level: "debug", // Minimum level: debug
      datePattern: "YYYY-MM-DD", // Rotate daily
      dirname: logDir + "/debug", // Directory for debug logs
      filename: "%DATE%.log", // Log file name pattern
      maxFiles: 30, // Keep logs for 30 days
      json: false, // Plain text logs
      zippedArchive: true, // Compress old logs
    }),
    // error log setting: writes error logs to daily rotated files
    new winstonDaily({
      level: "error", // Minimum level: error
      datePattern: "YYYY-MM-DD", // Rotate daily
      dirname: logDir + "/error", // Directory for error logs
      filename: "%DATE%.log", // Log file name pattern
      maxFiles: 30, // Keep logs for 30 days
      handleExceptions: true, // Log unhandled exceptions
      json: false, // Plain text logs
      zippedArchive: true, // Compress old logs
    }),
  ],
});

// Add console transport for colored output in development
logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
  }),
);

// Stream object for morgan HTTP request logging middleware
const stream = {
  write: (message: string) => {
    // Remove trailing newline and log as info
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

// Export logger and stream for use in other modules
export { logger, stream };