// Multer middleware for handling file uploads in Express
//
// This middleware sets up file upload handling with the following features:
// - Limits the number of files and file size per upload
// - Stores files in the 'uploads/' directory with a unique filename
// - Filters files to only allow certain image and application types

import { Request } from "express";
import multer from "multer";

import { HttpException } from "@exceptions/HttpException";
import { MAX_SIZE_FILE_UPLOAD } from "@config/index";

/**
 * Multer instance configured for file uploads.
 *
 * - Limits:
 *   - Maximum 10 files per request
 *   - Maximum file size as defined in MAX_SIZE_FILE_UPLOAD
 * - Storage:
 *   - Files are stored in the 'uploads/' directory
 *   - Filenames are prefixed with the current timestamp for uniqueness
 * - File Filter:
 *   - Only allows files with mimetypes matching image or application/(jpg|jpeg|png)
 *   - Throws HttpException on invalid file format
 */
export const uploadFile = multer({
  // Set file and size limits
  limits: {
    files: 10, // Maximum number of files per request
    fileSize: Number(MAX_SIZE_FILE_UPLOAD), // Maximum file size per file
  },
  // Configure disk storage for uploaded files
  storage: multer.diskStorage({
    // Set destination directory for uploads
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    // Set filename format: <timestamp>-<originalname>
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  // Filter files by mimetype
  fileFilter(req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
    // Only allow image or application/(jpg|jpeg|png) mimetypes
    if (!file.mimetype.match(/^image|application\/(jpg|jpeg|png)$/)) { // Regex
      return callback(new HttpException(false, 400, "Invalid File Format"));
    }
    callback(null, true);
  },
});