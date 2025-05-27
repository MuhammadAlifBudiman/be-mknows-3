/**
 * Custom HTTP Exception base class extending the built-in Error class.
 * Used to standardize error responses throughout the application.
 */
export class HttpException extends Error {
  /** Indicates if the request was successful (always false for exceptions) */
  public success: boolean;
  /** HTTP status code for the error (e.g., 404, 500) */
  public status: number;
  /** Error message describing the exception */
  public message: string;
  /** Optional array of detailed error messages */
  public errors?: string[];

  /**
   * Constructs a new HttpException instance.
   * @param success - Indicates success (should be false)
   * @param status - HTTP status code
   * @param message - Error message
   * @param errors - Optional array of error details
   */
  constructor(success: boolean, status: number, message: string, errors?: string[]) {
    super(message);
    this.success = success;
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

/**
 * Exception for HTTP 429 Too Many Requests errors.
 * Extends HttpException with a fixed status and message.
 */
export class HttpExceptionTooManyRequests extends HttpException {
  /**
   * Constructs a new HttpExceptionTooManyRequests instance.
   * @param errors - Array of error details
   */
  constructor(errors: string[]) {
    super(false, 429, "TOO_MANY_REQUEST", errors);
  }
}