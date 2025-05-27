/**
 * OTP interface represents a One-Time Password entity.
 * @property {number} pk - Primary key of the OTP record.
 * @property {string} uuid - Universally unique identifier for the OTP.
 * @property {number} user_id - ID of the user associated with the OTP.
 * @property {string} key - The OTP value or code.
 * @property {string} type - The type/category of the OTP (e.g., email, sms).
 * @property {string} status - The status of the OTP (e.g., active, used, expired).
 * @property {Date} [expired_at] - Optional expiration date and time for the OTP.
 */
export interface OTP {
  pk: number; // Primary key
  uuid: string; // Unique identifier for the OTP
  user_id: number; // Associated user ID
  key: string; // OTP code
  type: string; // OTP type (e.g., email, sms)
  status: string; // OTP status (e.g., active, used, expired)
  expired_at?: Date; // Optional expiration timestamp
}

/**
 * createOTP interface for creating a new OTP record.
 * @property {number} user_id - ID of the user for whom the OTP is created.
 */
export interface createOTP {
  user_id: number; // User ID for OTP creation
}