// Data Transfer Objects (DTOs) for Category operations
// Import validation decorators from class-validator
import { IsString, IsNotEmpty, MinLength, IsOptional } from "class-validator";

/**
 * DTO for creating a new Category
 * - name: required, string, not empty
 * - description: required, string, not empty, minimum length 4
 */
export class CreateCategoryDto {
  /**
   * Name of the category
   * @type {string}
   * @required
   */
  @IsString()
  @IsNotEmpty()
  public name: string;

  /**
   * Description of the category
   * @type {string}
   * @required
   * @minLength 4
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public description: string;
}

/**
 * DTO for updating an existing Category
 * - name: optional, string
 * - description: optional, string, minimum length 4
 */
export class UpdateCategoryDto {
  /**
   * Name of the category (optional)
   * @type {string}
   */
  @IsString()
  @IsOptional()
  public name: string;

  /**
   * Description of the category (optional)
   * @type {string}
   * @minLength 4
   */
  @IsString()
  @MinLength(4)
  @IsOptional()
  public description: string;
}