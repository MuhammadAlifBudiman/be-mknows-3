// ApiResponse interface defines the standard structure for API responses.
//
// Properties:
//   code: number - HTTP status code or custom application code.
//   status: string - Status of the response, e.g., 'success' or 'error'.
//   message: string - Human-readable message describing the response.
//   data?: undefined | object | unknown - Optional payload containing the response data.
//   errors?: unknown[] - Optional array of error details, if any.
//   meta?: Pagination - Optional pagination metadata for paginated responses.

import { Pagination } from "@interfaces/common/pagination.interface";

/**
 * Standard API response interface.
 *
 * @property {number} code - HTTP status code or custom application code.
 * @property {string} status - Status of the response (e.g., 'success', 'error').
 * @property {string} message - Human-readable message for the response.
 * @property {object | unknown} [data] - Optional response payload.
 * @property {unknown[]} [errors] - Optional array of error details.
 * @property {Pagination} [meta] - Optional pagination metadata.
 */
export interface ApiResponse {
  code: number; // HTTP status code or custom application code
  status: string; // Status of the response (e.g., 'success', 'error')
  message: string; // Human-readable message for the response
  data?: undefined | object | unknown; // Optional response payload
  errors?: unknown[]; // Optional array of error details
  meta?: Pagination; // Optional pagination metadata
}