// Data Transfer Object (DTO) for updating user profile information
// Uses class-validator decorators to enforce validation rules

import { 
  IsOptional, // Marks a property as optional during validation
  IsString,   // Ensures the property is a string
  IsUUID,     // Ensures the property is a valid UUID
  MaxLength,  // Sets the maximum length for a string property
  MinLength,  // Sets the minimum length for a string property
} from "class-validator";

/**
 * DTO for updating user profile data.
 * Contains validation rules for each property.
 */
export class UpdateUserProfileDto {
  /**
   * The full name of the user.
   * - Optional
   * - Must be a string
   * - Minimum length: 3
   * - Maximum length: 124
   */
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(124)
  public full_name: string;

  /**
   * The UUID of the user's display picture.
   * - Optional
   * - Must be a valid UUID
   * - Maximum length: 36
   */
  @IsUUID()
  @IsOptional()
  @MaxLength(36)
  public display_picture: string;
}