// CategoryService handles CRUD operations for categories in the database.
// Uses typedi for dependency injection and Sequelize for DB operations.
import { Service } from "typedi"; // Import Service decorator for dependency injection
import { DB } from "@database"; // Import database instance

import { Category } from '@interfaces/category.interface'; // Category interface
import { HttpException } from "@exceptions/HttpException"; // Custom HTTP exception
import { CreateCategoryDto, UpdateCategoryDto } from '@dtos/categories.dto'; // DTOs for category creation and update

/**
 * Service for managing categories.
 */
@Service()
export class CategoryService {
  /**
   * Get all categories from the database.
   * Excludes the 'pk' attribute from the result.
   * @returns {Promise<Category[]>} List of categories
   */
  public async getCategories(): Promise<Category[]> {
    return await DB.Categories.findAll({ 
      attributes: { 
        exclude: ["pk"], // Exclude primary key from result
      },
    });
  }

  /**
   * Create a new category in the database.
   * @param {CreateCategoryDto} data - Data for the new category
   * @returns {Promise<Category>} The created category
   */
  public async createCategory(data: CreateCategoryDto): Promise<Category> {
    const category = await DB.Categories.create({ ...data }); // Create category
    delete category.dataValues.pk; // Remove 'pk' from returned data

    return category;
  }
  
  /**
   * Update an existing category by UUID.
   * Only updates provided fields (name, description).
   * Throws error if no fields are provided.
   * @param {string} category_id - UUID of the category
   * @param {UpdateCategoryDto} data - Data to update
   * @returns {Promise<Category>} The updated category
   */
  public async updateCategory(category_id: string, data: UpdateCategoryDto): Promise<Category> {
    const updatedData: any = {};
    
    if (data.name) updatedData.name = data.name; // Update name if provided
    if (data.description) updatedData.description = data.description; // Update description if provided

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required"); // Require at least one field
    }

    // Update category and return updated instance
    const [_, [category]] = await DB.Categories.update(updatedData, {
      where: { uuid: category_id },
      returning: true,
    });
    
    delete category.dataValues.pk; // Remove 'pk' from returned data

    return category;
  }

  /**
   * Delete a category by UUID.
   * Throws error if category is not found.
   * @param {string} category_id - UUID of the category
   * @returns {Promise<boolean>} True if deleted
   */
  public async deleteCategory(category_id: string): Promise<boolean> {
    const category = await DB.Categories.findOne({ where: { uuid: category_id }}); // Find category

    if(!category) {
      throw new HttpException(false, 400, "Category is not found"); // Not found error
    }

    await category.destroy(); // Delete category
    return true;
  }
}