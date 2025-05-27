// auth.service.ts
// Service for handling authentication logic, user signup, login, logout, session management, and email verification.

import { compare, hash } from "bcrypt"; // For password hashing and comparison
import { sign } from "jsonwebtoken"; // For JWT token creation
import { Service } from "typedi"; // Dependency injection
import { Transaction } from "sequelize"; // For database transactions

import { SECRET_KEY } from "@config/index"; // Application secret key for JWT
import { DB } from "@database"; // Database instance

import { OTPService } from "@services/otps.service"; // Service for OTP management

import { User } from "@interfaces/user.interface"; // User interface
import { UserRole } from "@interfaces/authentication/user-role.interface"; // User role interface
import { UserSession } from "@interfaces/user-session.interface"; // User session interface
import { UserAgent } from "@interfaces/common/useragent.interface"; // User agent interface
import { DataStoredInToken, TokenPayload } from "@interfaces/authentication/token.interface"; // JWT token interfaces

import { CreateUserDto } from "@dtos/users.dto"; // DTO for user creation
import { HttpException } from "@exceptions/HttpException"; // Custom HTTP exception
import { sendEmailOTP } from "@utils/mailer"; // Utility to send OTP via email

/**
 * Helper function to create an access token (JWT) for a user session.
 * @param user - User object
 * @param userSession - User session object
 * @returns TokenPayload containing JWT and expiration
 */
const createAccessToken = (user: User, userSession: UserSession): TokenPayload => {
  // Data to be stored in JWT
  const dataStoredInToken: DataStoredInToken = { uid: user.uuid, sid: userSession.uuid };
  // Token expiration time (in seconds)
  const expiresIn: number = 60 * 60 * 60;

  return { expiresIn: expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
};  

/**
 * Helper function to create a cookie string for the JWT token.
 * @param TokenPayload - Token payload containing JWT and expiration
 * @returns Cookie string
 */
const createCookie = (TokenPayload: TokenPayload): string => {
  return `Authorization=${TokenPayload.token}; HttpOnly; Max-Age=${TokenPayload.expiresIn};`;
};

/**
 * AuthService class for handling authentication and user session logic.
 */
@Service()
export class AuthService {
  /**
   * Register a new user, assign default role, and send email verification OTP.
   * @param userData - Data for creating a new user
   * @returns Object containing user uuid and email
   * @throws HttpException if email already exists or on error
   */
  public async signup(userData: CreateUserDto): Promise<{ uuid: string, email: string }> {
    const transaction = await DB.sequelize.transaction();

    try {
      // Check if user already exists
      const existingUser = await DB.Users.findOne({ where: { email: userData.email }, transaction });
      
      // Debug: List all users (can be removed in production)
      console.log(await DB.Users.findAll({
        where: {
          
        }
      }))
      if (existingUser) {
        throw new HttpException(false, 409, `This email ${userData.email} already exists`);
      }
  
      // Hash the password
      const hashedPassword = await hash(userData.password, 10);
  
      // Create the user
      const createUser = await DB.Users.create(
        { ...userData, password: hashedPassword },
        { transaction }
      );
  
      // Assign default USER role
      const roleId = await this.getRoleId("USER");
      await this.asignUserRole(createUser.pk, roleId, transaction);
      
      // Generate OTP for email verification
      const validInMinutes = 10;
      const otp = await new OTPService().createOTP({
        user_id: createUser.pk,
        type: "EMAIL_VERIFICATION",
      }, validInMinutes, transaction);
      
      // Send OTP to user's email
      await sendEmailOTP({
        email: createUser.email,
        full_name: createUser.full_name,
        otp: otp.key,
        expiration_time: validInMinutes,
      });

      // Commit transaction
      await transaction.commit();
      
      return { uuid: createUser.uuid, email: createUser.email };
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error; 
    }
  }

  /**
   * Login user, check credentials, verify email, and create session.
   * @param userData - User login data
   * @param userAgent - User agent info
   * @returns Object containing cookie and accessToken
   * @throws HttpException if user not found, password mismatch, or email not verified
   */
  public async login(userData: CreateUserDto, userAgent: UserAgent): Promise<{ cookie: string; accessToken: string }> {
    // Find user by email
    const findUser: User = await DB.Users.findOne({ attributes: ["pk", "uuid", "password", "email_verified_at"], where: { email: userData.email } });
    if (!findUser) throw new HttpException(false, 409, `This email ${userData.email} was not found`);

    // Compare password
    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(false, 409, "Password not matching");

    // Check if email is verified
    if(!findUser.email_verified_at) throw new HttpException(false, 400, "Email is not verified");
    
    // Create user session
    const sessionData = await this.createUserSession({ 
      pk: findUser.pk, useragent: userAgent.source, ip_address: userAgent.ip_address
    });

    // Create JWT token
    const TokenPayload = createAccessToken(findUser, sessionData);
    const { token } = TokenPayload;

    // Create cookie
    const cookie = createCookie(TokenPayload);
    return { cookie, accessToken: token };
  }

  /**
   * Logout user by ending the active session.
   * @param userData - User object
   * @param userSessionId - Session UUID
   * @returns True if logout successful
   * @throws HttpException if user not found
   */
  public async logout(userData: User, userSessionId: string): Promise<boolean> {
    // Find user by primary key
    const findUser: User = await DB.Users.findOne({ where: { pk: userData.pk } });
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");

    // Logout session
    const logout = await this.logoutSessionActive({ uid: findUser.uuid, sid: userSessionId });
    return logout;
  }

  /**
   * Check if a session is active by session UUID.
   * @param session_id - Session UUID
   * @returns UserSession object or null
   */
  public async checkSessionActive(session_id: string): Promise<UserSession> {
    const userSession = await DB.UsersSessions.findOne({ 
      where: { uuid: session_id, status: "ACTIVE" },
      include: [{ model: DB.Users, as: "user" }]
    });

    return userSession || null;
  };

  /**
   * Get all roles for a user by user ID.
   * @param user_id - User primary key
   * @returns Array of UserRole
   */
  public async getUserRoles(user_id: number): Promise<UserRole[]> {
    const roles = await DB.UsersRoles.findAll({ 
      where: { user_id },
      include: [{ model: DB.Roles, as: "role" }]
    });

    return roles;
  };

  /**
   * Logout an active session by updating its status.
   * @param data - Object containing user UUID and session UUID
   * @returns True if logout successful
   */
  public async logoutSessionActive(data: { uid: string, sid: string }): Promise<boolean> {
    const userSession = await DB.UsersSessions.findOne({ 
      where: { uuid: data.sid, status: "ACTIVE" },
      include: { model: DB.Users, as: "user" }
    });
  
    if (userSession) {
      userSession.status = "LOGOUT";
      await userSession.save();
      return true;
    } else {
      return true;
    }
  }

  /**
   * Create a new user session.
   * @param data - Object containing user pk, useragent, and ip_address
   * @returns UserSession object
   */
  public async createUserSession(data: { pk: number, useragent: string, ip_address: string }): Promise<UserSession> {
    const session = await DB.UsersSessions.create({
      user_id: data.pk,
      useragent: data.useragent,
      ip_address: data.ip_address,
      status: "ACTIVE"
    });

    return session;
  };

  /**
   * Get the role ID by role name.
   * @param name - Role name
   * @returns Role primary key
   */
  private async getRoleId(name: string): Promise<number> {
    const role = await DB.Roles.findOne({ where: { name }});
    return role.pk;
  }

  /**
   * Assign a role to a user within a transaction.
   * @param user_id - User primary key
   * @param role_id - Role primary key
   * @param transaction - Sequelize transaction
   * @returns UserRole object
   */
  private async asignUserRole(user_id: number, role_id: number, transaction: Transaction): Promise<UserRole> {
    const role = await DB.UsersRoles.create({ user_id, role_id }, { transaction });
    return role;
  }

  /**
   * Verify user's email using OTP.
   * @param user_uuid - User UUID
   * @param otp - OTP key
   * @returns Object containing user email
   * @throws HttpException if UUID invalid or OTP not found
   */
  public async verifyEmail(user_uuid: string, otp: string): Promise<{ email: string }> {
    const user = await DB.Users.findOne({ attributes: ["pk"], where: { uuid: user_uuid } } );
    if(!user) throw new HttpException(false, 400, "Invalid UUID");
    
    const valid = await new OTPService().findOTP({ 
      user_id: user.pk, key: otp, type: "EMAIL_VERIFICATION"
    });

    if(valid) {
      user.email_verified_at = new Date();

      await user.save();
    }

    return { email: user.email };
  };

  /**
   * Resend email verification OTP to user.
   * @param user_uuid - User UUID
   * @returns Object containing user email
   * @throws HttpException if UUID invalid or email already verified
   */
  public async resendVerifyEmail(user_uuid: string): Promise<{ email: string }> {
    const transaction = await DB.sequelize.transaction();
    const user = await DB.Users.findOne({ where: { uuid: user_uuid } } );
    if(!user) throw new HttpException(false, 400, "Invalid UUID");
    if(user.email_verified_at) throw new HttpException(false, 400, "Email already verified");

    try {
      // Generate new OTP
      const validInMinutes = 10;
      const otp = await new OTPService().createOTP({
        user_id: user.pk,
        type: "EMAIL_VERIFICATION",
      }, validInMinutes, transaction);

      // Send OTP to user's email
      await sendEmailOTP({
        email: user.email,
        full_name: user.full_name,
        otp: otp.key,
        expiration_time: validInMinutes,
      });

      // Commit transaction
      await transaction.commit();

      return { email: user.email };
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error; 
    }
  }
}