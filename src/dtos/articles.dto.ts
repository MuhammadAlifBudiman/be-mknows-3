// Data Transfer Object (DTO) for creating and updating an article
// Uses class-validator decorators to enforce validation rules
import { IsString, IsNotEmpty, MinLength, IsOptional, IsArray, IsUUID } from "class-validator";

/**
 * DTO for creating a new article
 * - title: Article title (required, string, not empty)
 * - description: Article description (required, string, min 4 chars)
 * - content: Article content (required, string, min 4 chars)
 * - thumbnail: Thumbnail identifier (required, string or number, min 36 chars)
 * - categories: Array of category UUIDs (required, array of UUID v4)
 */
export class CreateArticleDto {
  /**
   * Article title
   * @type {string}
   * @required
   */
  @IsString()
  @IsNotEmpty()
  public title: string;

  /**
   * Article description
   * @type {string}
   * @required
   * @minLength 4
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public description: string;

  /**
   * Article content
   * @type {string}
   * @required
   * @minLength 4
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public content: string;

  /**
   * Thumbnail identifier (string or number, min 36 chars)
   * @type {string | number}
   * @required
   * @minLength 36
   */
  @IsString()
  @IsNotEmpty()
  @MinLength(36)
  public thumbnail: string | number;

  /**
   * List of category UUIDs (v4)
   * @type {string[]}
   * @required
   */
  @IsArray()
  @IsUUID("4", { each: true })
  @IsNotEmpty()
  public categories: string[];
}

/**
 * DTO for updating an article
 * All fields are optional, but must match validation if provided
 * - title: Article title (optional, string)
 * - description: Article description (optional, string, min 4 chars)
 * - content: Article content (optional, string, min 4 chars)
 * - thumbnail: Thumbnail identifier (optional, string or number, min 36 chars)
 * - categories: Array of category UUIDs (optional, array of UUID v4)
 */
export class UpdateArticleDto {
  /**
   * Article title (optional)
   * @type {string}
   */
  @IsString()
  @IsOptional()
  public title: string;

  /**
   * Article description (optional, min 4 chars)
   * @type {string}
   */
  @IsString()
  @MinLength(4)
  @IsOptional()
  public description: string;

  /**
   * Article content (optional, min 4 chars)
   * @type {string}
   */
  @IsString()
  @MinLength(4)
  @IsOptional()
  public content: string;

  /**
   * Thumbnail identifier (optional, string or number, min 36 chars)
   * @type {string | number}
   */
  @IsString()
  @MinLength(36)
  @IsOptional()
  public thumbnail: string | number;

  /**
   * List of category UUIDs (v4, optional)
   * @type {string[]}
   */
  @IsArray()
  @IsUUID("4", { each: true })
  @IsOptional()
  public categories: string[];
}