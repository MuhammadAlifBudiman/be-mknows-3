/**
 * UserSession interface represents a user session record in the system.
 * It contains information about the session, user, and metadata.
 */
import { User } from "@interfaces/user.interface";

/**
 * Represents a user session.
 */
export interface UserSession {
  /**
   * Primary key of the session record.
   */
  pk: number;
  /**
   * Universally unique identifier for the session.
   */
  uuid: string;

  /**
   * The ID of the user associated with this session.
   */
  user_id: number;
  /**
   * The user agent string from the user's browser or client.
   */
  useragent: string;
  /**
   * The IP address from which the session was created.
   */
  ip_address: string;
  /**
   * The status of the session (e.g., active, expired).
   */
  status: string;

  /**
   * Indicates if this session is the current active session for the user.
   */
  is_current?: boolean;
  /**
   * The user object associated with this session (optional).
   */
  user?: User;
}