/**
 * Utility function to parse and extract user agent information from an Express request.
 *
 * @param req - Express Request object containing headers and connection info
 * @returns {UserAgentInterface} Parsed user agent details
 */
import { Request } from "express";
import { UserAgent } from "express-useragent";
import { UserAgent as UserAgentInterface } from "@/interfaces/common/useragent.interface";

/**
 * Parses the user agent string from the request headers and constructs a user agent payload.
 *
 * @param req - The Express request object
 * @returns {UserAgentInterface} An object containing browser, version, OS, platform, IP address, referrer, and source
 */
export const getUserAgent = (req: Request): UserAgentInterface => {
  // Parse the user-agent string from the request headers using express-useragent
  const userAgent = new UserAgent().parse(req.headers["user-agent"] as string);

  // Optionally filter out empty string values from the parsed user agent object
  // const parsedUseragent = Object.entries(userAgent).reduce((obj, [key, value]) => {
  //   if (typeof value == "string" && value.length !== 0) obj[key] = value;
  //   return obj;
  // }, {});

  /**
   * Construct the user agent payload with relevant properties:
   * - browser: Name of the browser
   * - version: Browser version
   * - os: Operating system
   * - platform: Device platform
   * - ip_address: Client IP address (from various possible sources)
   * - referrer: Referrer URL from headers
   * - source: Raw user agent string
   */
  const userAgentPayload: UserAgentInterface = {
    browser: userAgent.browser, // Browser name
    version: userAgent.version, // Browser version
    os: userAgent.os,           // Operating system
    platform: userAgent.platform, // Device platform
    ip_address:
      req.clientIp?.replace("::ffff:", "") || // Prefer clientIp if available, remove IPv6 prefix
      req.socket.remoteAddress ||              // Fallback to socket remote address
      req.connection.remoteAddress ||          // Fallback to connection remote address
      req.headers["x-forwarded-for"] as string, // Fallback to x-forwarded-for header
    referrer: req.headers.referer,             // Referrer URL
    source: userAgent.source,                  // Raw user agent string
  };

  // Return the constructed user agent payload
  return userAgentPayload;
};