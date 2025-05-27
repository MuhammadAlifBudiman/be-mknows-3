import { Pagination } from "@interfaces/common/pagination.interface";
import { ApiResponse } from "@interfaces/common/api-response.interface";

/**
 * Returns a custom API response object.
 *
 * @template T - The type of the pagination meta data, must extend Pagination.
 * @param {number} code - The HTTP status code for the response.
 * @param {string} responseStatus - The status of the response (e.g., 'success', 'error').
 * @param {string} message - A descriptive message for the response.
 * @param {unknown} [data] - The main data payload of the response (optional).
 * @param {T} [meta] - Optional pagination or meta information.
 * @returns {ApiResponse} The formatted API response object.
 */
export function apiResponse<T extends Pagination>(
  code: number, // HTTP status code
  responseStatus: string, // Response status string
  message: string, // Response message
  data?: unknown, // Optional data payload
  meta?: T, // Optional meta information (pagination, etc.)
): ApiResponse {
  return {
    code, // HTTP status code
    status: responseStatus, // Response status string
    message, // Response message
    data: data || {}, // Data payload, defaults to empty object if not provided
    meta, // Meta information (pagination, etc.)
  };
}