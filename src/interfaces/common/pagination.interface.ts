/**
 * Pagination interface for paginated API responses.
 *
 * @property {number} current_page - The current page number being viewed.
 * @property {number} size_page - The number of items per page.
 * @property {number} max_page - The total number of pages available.
 * @property {number} total_data - The total number of data items across all pages.
 */
export interface Pagination {
  /** The current page number being viewed. */
  current_page: number;
  /** The number of items per page. */
  size_page: number;
  /** The total number of pages available. */
  max_page: number;
  /** The total number of data items across all pages. */
  total_data: number;
}