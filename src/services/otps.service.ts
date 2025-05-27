import { Service } from "typedi";
import { Transaction } from "sequelize";
import { DB } from "@database";

import { OTP } from "@interfaces/otp.interface";
import { HttpException } from "@exceptions/HttpException";

// OTPService handles OTP (One-Time Password) generation, validation, and status management.
//
// Dependencies:
// - typedi: For dependency injection.
// - sequelize: For transaction management.
// - DB: Database access layer.
// - OTP: OTP interface definition.
// - HttpException: Custom HTTP error handling.

@Service()
export class OTPService {
  /**
   * Generate and store a new OTP for a user.
   * @param data - Object containing user_id and type of OTP.
   * @param validInMinutes - OTP validity duration in minutes.
   * @param transaction - Sequelize transaction for atomic DB operation.
   * @returns The created OTP instance.
   */
  public async createOTP(data, validInMinutes: number, transaction: Transaction): Promise<OTP> {
    // Generate an 8-digit random OTP key as a string
    const key = Math.floor(Math.pow(10, 8 - 1) + Math.random() * 9 * Math.pow(10, 8 - 1)).toString();
    // Get current date and time
    const currentDateTime = new Date();
    // Calculate expiration time by adding validInMinutes to current time
    const expirationTime = new Date(currentDateTime.getTime() + validInMinutes * 60000);
  
    // Store OTP in the database with status 'AVAILABLE' and expiration time
    const otp = await DB.OTPs.create({
      user_id: data.user_id, // User identifier
      key,                   // Generated OTP key
      type: data.type,       // OTP type (e.g., email, sms)
      status: "AVAILABLE",  // Initial status
      expired_at: expirationTime, // Expiration timestamp
    }, { transaction });

    return otp;
  }

  /**
   * Validate an OTP for a user and update its status.
   * @param data - Object containing user_id, key, and type.
   * @returns True if OTP is valid and status updated; throws error otherwise.
   * @throws HttpException if OTP is invalid or expired.
   */
  public async findOTP(data: { user_id: number, key: string, type: string }): Promise<boolean> {
    // Find OTP with matching user_id, key, and status 'AVAILABLE'
    const otp = await DB.OTPs.findOne({
      where: {
        user_id: data.user_id,
        key: data.key,
        status: "AVAILABLE",
      }
    });

    // If OTP not found, throw error
    if(!otp) {
      throw new HttpException(false, 400, "OTP is not valid");
    }

    // If OTP is expired, update status to 'EXPIRED' and throw error
    if(new Date(otp.expired_at) < new Date()) {
      otp.status = "EXPIRED";
      await otp.save();

      throw new HttpException(false, 400, "OTP is not valid");
    }

    // If OTP is valid, update status to 'USED'
    otp.status = "USED";
    await otp.save();

    return true;
  }
}