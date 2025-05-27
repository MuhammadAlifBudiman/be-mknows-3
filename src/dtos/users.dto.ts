// Data Transfer Objects (DTOs) for user-related operations
// Provides validation rules for user input using class-validator

import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from "class-validator";

/**
 * DTO for creating a new user.
 * Validates email, password, and full name fields.
 */
export class CreateUserDto {
  /**
   * User's email address. Must be a valid email format.
   */
  @IsEmail()
  public email: string;

  /**
   * User's password. Must be a string, not empty, 4-32 characters.
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  public password: string;
  
  /**
   * User's full name. Must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty()
  public full_name: string;
}

/**
 * DTO for user login.
 * Validates email and password fields.
 */
export class LoginUserDto {
  /**
   * User's email address. Must be a valid email format.
   */
  @IsEmail()
  public email: string;

  /**
   * User's password. Must be a string, not empty, 4-32 characters.
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  public password: string;
}

/**
 * DTO for updating a user's password.
 * Validates password field.
 */
export class UpdateUserDto {
  /**
   * New password. Must be a string, not empty, 9-32 characters.
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}