import { Service } from "typedi";
import { DB } from "@database";

import { User } from "@interfaces/user.interface";
import { UserSession } from "@interfaces/user-session.interface";

import { UserModel } from "@models/users.model";
import { UserSessionModel } from "@models/users_sessions.model";
import { UpdateUserProfileDto } from "@dtos/account.dto";
import { HttpException } from "@/exceptions/HttpException";

// AccountService handles user account-related operations such as profile retrieval, session history, and profile updates.
@Service()
export class AccountService {
  /**
   * Retrieves the user profile by user ID.
   * @param user_id - The primary key of the user.
   * @returns The user profile with display picture UUID.
   */
  public async getProfileByUserId(user_id: number): Promise<User> {
    // Find user by primary key, excluding the 'pk' attribute
    const user: UserModel = await DB.Users.findOne({ 
      attributes: { exclude: ["pk"] },
      where: { pk: user_id }
    });

    // Find the file associated with the user's display picture
    const file = await DB.Files.findOne({ where: { pk: user.display_picture }});

    // Construct response with display picture UUID
    const response = {
      ...user.get(),
      display_picture: file?.uuid,
    };

    return response;
  }

  /**
   * Retrieves all session histories for a user, marking the current session.
   * @param user_id - The user's primary key.
   * @param session_id - The current session's UUID.
   * @returns Array of user sessions with 'is_current' flag.
   */
  public async getSessionsHistoriesByUserId(user_id: number, session_id: string): Promise<UserSession[]> {
    // Find all sessions for the user, excluding 'pk' and 'user_id'
    const userSessions: UserSessionModel[] = await DB.UsersSessions.findAll({
      attributes: { exclude: ["pk", "user_id"] },
      where: { user_id }
    });

    // Map sessions to include 'is_current' property
    const userSessionsParsed = userSessions.map(session => ({
      ...session.get(),
      is_current: session.uuid === session_id
    }));

    // Sort so current session appears first
    userSessionsParsed.sort((a, b) => (b.is_current ? 1 : 0) - (a.is_current ? 1 : 0));
    return userSessionsParsed;
  }

  /**
   * Updates the user's profile information.
   * @param user_id - The user's primary key.
   * @param data - The profile update data (full_name, display_picture).
   * @returns The updated user profile with display picture UUID.
   * @throws HttpException if file is not found or no fields are provided.
   */
  public async updateUserProfile(user_id: number, data: UpdateUserProfileDto): Promise<User> {
    // Prepare object for updated fields
    const updatedData: any = {};
  
    // Update full_name if provided
    if (data.full_name) updatedData.full_name = data.full_name;
  
    // Update display_picture if provided
    if (data.display_picture) {
      // Find file by UUID and user_id
      const file = await DB.Files.findOne({ attributes: ["pk"], where: { uuid: data.display_picture, user_id } });
  
      // Throw error if file not found
      if (!file) {
        throw new HttpException(false, 400, "File is not found");
      }
  
      updatedData.display_picture = file.pk;
    }
  
    // Throw error if no fields to update
    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }
  
    // Update user and return updated instance
    const [_, [user]] = await DB.Users.update(updatedData, {
      where: { pk: user_id },
      returning: true,
    });

    // Remove sensitive/internal fields
    delete user.dataValues.pk;
    delete user.dataValues.password;

    // Find updated display picture file
    const file = await DB.Files.findOne({ where: { pk: user.display_picture }});
    
    // Construct response with display picture UUID
    const response = {
      ...user.get(),
      display_picture: file?.uuid,
    }

    return response;
  }
}