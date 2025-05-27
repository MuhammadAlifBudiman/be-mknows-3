/**
 * UserAgent interface represents the structure of user agent information
 * typically extracted from HTTP requests for logging, analytics, or security purposes.
 */
export interface UserAgent {
  /** The name of the browser (e.g., Chrome, Firefox, Safari) */
  browser: string;
  /** The version of the browser */
  version: string;
  /** The operating system of the user (e.g., Windows, macOS, Linux) */
  os: string;
  /** The platform type (e.g., desktop, mobile, tablet) */
  platform: string;
  /** The IP address of the user */
  ip_address: string;
  /** The referrer URL from which the user navigated */
  referrer: string;
  /** The source of the request (e.g., direct, campaign, social) */
  source: string,
}