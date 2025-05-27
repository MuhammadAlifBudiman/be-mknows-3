/**
 * Interface representing a File entity.
 * @property {number} pk - Primary key identifier for the file.
 * @property {string} uuid - Universally unique identifier for the file.
 * @property {string} name - Name of the file.
 * @property {number} user_id - ID of the user who owns the file.
 * @property {string} type - MIME type or file extension (e.g., 'image/png', 'pdf').
 * @property {number} size - Size of the file in bytes.
 */
export interface File {
  pk: number; // Primary key identifier
  uuid: string; // Unique file identifier

  name: string; // File name
  user_id: number; // Owner's user ID
  type: string; // File type (MIME or extension)
  size: number; // File size in bytes
}