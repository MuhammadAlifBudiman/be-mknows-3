// File Service for handling file-related operations
// Uses typedi for dependency injection and interacts with the database via DB.Files

import { Service } from "typedi"; // Import Service decorator for dependency injection
import { DB } from "@database"; // Import database instance

import { File } from "@interfaces/file.interface"; // Import File interface
import { HttpException } from "@/exceptions/HttpException"; // Import custom HttpException

/**
 * Service class for file operations (upload, fetch, list)
 */
@Service()
export class FileService {
  /**
   * Upload a single file for a user
   * @param user_id - ID of the user uploading the file
   * @param file - File object from Multer
   * @returns The uploaded file record (with some fields removed)
   */
  public async uploadSingleFile(user_id: number, file: Express.Multer.File): Promise<File> {
    // Create a new file record in the database
    const fileUpload = await DB.Files.create({
      user_id,
      name: file.filename,
      type: file.mimetype,
      size: file.size
    });

    // Remove sensitive or unnecessary fields from the returned object
    delete fileUpload.dataValues.pk;
    delete fileUpload.dataValues.name;
    delete fileUpload.dataValues.user_id;

    return fileUpload;
  };
  
  /**
   * Get a file's name by its UUID
   * @param file_uuid - UUID of the file
   * @returns The file record with only the name attribute
   * @throws HttpException if file is not found
   */
  public async getFileWithUUID(file_uuid: string): Promise<File> {
    // Find the file by UUID, only select the name attribute
    const file = await DB.Files.findOne({
      attributes: ["name"],
      where: {
        uuid: file_uuid
      }
    });

    // Throw an exception if file is not found
    if(!file) throw new HttpException(false, 400, "File is not found");
    return file;
  };

  /**
   * Get all files uploaded by a user
   * @param user_id - ID of the user
   * @returns Array of file records (excluding pk, user_id, name)
   */
  public async getUserFiles(user_id: number): Promise<File[]> {
    // Find all files for the user, exclude certain attributes
    const files = await DB.Files.findAll({
      attributes: { exclude: ["pk", "user_id", "name"] },
      where: {
        user_id
      }
    });

    return files;
  };
};