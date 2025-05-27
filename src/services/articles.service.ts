// ArticleService handles all business logic related to articles, including CRUD operations, category filtering, and parsing for API responses.
import { Op } from "sequelize"; // Sequelize operators for query building
import { Service } from "typedi"; // Dependency injection decorator
import { DB } from "@database"; // Database instance

import { FileModel } from "@models/files.model"; // File model
import { UserModel } from "@models/users.model"; // User model

import { CategoryModel } from "@models/categories.model"; // Category model
import { ArticleModel } from "@models/articles.model"; // Article model
import { ArticleCategoryModel } from "@models/articles_categories.model"; // Article-Category join model

import { Article, ArticleParsed, ArticleQueryParams } from "@interfaces/article.interface"; // Article interfaces
import { Pagination } from "@interfaces/common/pagination.interface"; // Pagination interface
import { CreateArticleDto, UpdateArticleDto } from "@dtos/articles.dto"; // DTOs for create/update
import { HttpException } from "@exceptions/HttpException"; // Custom HTTP exception

/**
 * Service for managing articles, including CRUD, filtering, and parsing.
 */
@Service()
export class ArticleService {
  /**
   * Parses an ArticleModel instance into an ArticleParsed object for API responses.
   * @param article ArticleModel instance
   * @returns ArticleParsed object
   */
  private articleParsed(article: ArticleModel): ArticleParsed {
    return {
      uuid: article.uuid, // Article UUID
      title: article.title, // Article title
      description: article.description, // Article description
      content: article.content, // Article content

      thumbnail: article.thumbnail?.uuid, // Thumbnail UUID (optional)
      author: {
        uuid: article.author.uuid, // Author UUID
        full_name: article.author.full_name || null, // Author full name
        avatar: article.author.avatar?.uuid || null, // Author avatar UUID (optional)
      },
      categories: article.categories.map((articleCategory) => articleCategory.category) // List of categories
    };
  }

  /**
   * Retrieves a paginated list of articles, with optional search and sorting.
   * @param query Query parameters for pagination, search, and sorting
   * @returns List of parsed articles and pagination info
   */
  public async getArticles(query: ArticleQueryParams): Promise<{ articles: ArticleParsed[], pagination: Pagination }> {
    const { page = "1", limit = "10", search, order, sort } = query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {}; // Sequelize where clause

    // Search by title, description, content, or author full name
    if(search) {
      where[Op.or] = [];

      where[Op.or].push({
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            content: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      });

      where[Op.or].push({
        [Op.or]: [
          {
            "$author.full_name$": {
              [Op.iLike]: `%${search}%`,
            },
          }
        ],
      });
    }

    const orderClause = [];
    
    // Add sorting if provided
    if (order && sort) {
      if (sort === "asc" || sort === "desc") {
        orderClause.push([order, sort]);
      }
    }

    // Query articles with pagination, search, and sorting
    const { rows: articles, count } = await DB.Articles.findAndCountAll({ 
      where,
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ["pk"] },
      order: orderClause
    });

    // Pagination info
    const pagination: Pagination = {
      current_page: parseInt(page),
      size_page: articles.length,
      max_page: Math.ceil(count / parseInt(limit)),
      total_data: count,
    };

    // Transform articles for API response
    const transformedArticles = articles.map(article => this.articleParsed(article));
    return { articles: transformedArticles, pagination };
  }

  /**
   * Retrieves a single article by its UUID.
   * @param article_id Article UUID
   * @returns Parsed article
   * @throws HttpException if not found
   */
  public async getArticleById(article_id: string): Promise<ArticleParsed> {
    const article = await DB.Articles.findOne({
      where: { uuid: article_id },
    })

    if(!article) {
      throw new HttpException(false, 404, "Article is not found");
    }

    const response = this.articleParsed(article);
    return response;
  }

  /**
   * Retrieves articles by category, with pagination and optional search/sort.
   * @param query Query parameters
   * @param category_id Category UUID
   * @returns List of parsed articles and pagination info
   * @throws HttpException if category or articles not found
   */
  public async getArticlesByCategory(query: ArticleQueryParams, category_id: string): Promise<{ articles: ArticleParsed[], pagination: Pagination }> {
    const { page = "1", limit = "10", search, order, sort } = query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Find category by UUID
    const category = await DB.Categories.findOne({ attributes: ["pk"], where:{ uuid: category_id } });
    if (!category) {
      throw new HttpException(false, 400, "Category is not found");
    }

    // Find all article-category relations for this category
    const articlesCategory = await DB.ArticlesCategories.findAll({ where: { category_id: category.pk } });
    if(!articlesCategory) {
      throw new HttpException(false, 400, "Article with that category is not found");
    }

    const where = {}; // Where clause for articles

    // Search by title, description, or content
    if(search) {
      where[Op.or] = [];

      where[Op.or].push({
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            content: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      });

      // Note: Author search is commented out due to SQL error
      // Error missing FROM-clause entry for table "author"
      // where[Op.or].push({
      //   [Op.or]: [
      //     {
      //       "$author.full_name$": {
      //         [Op.iLike]: `%${search}%`,
      //       },
      //     }
      //   ],
      // });
    }

    const orderClause = [];
    
    // Add sorting if provided
    if (order && sort) {
      if (sort === "asc" || sort === "desc") {
        orderClause.push([order, sort]);
      }
    }

    // Get article IDs for this category
    const articleIds = articlesCategory.map(category => category.article_id);

    // Query articles by IDs, with pagination, search, and sorting
    const { rows: articles, count } = await DB.Articles.findAndCountAll({ 
      where: { 
        ...where,
        pk: { [Op.in]: articleIds }, 
      },
      attributes: { exclude: ["pk"] },
      limit: parseInt(limit),
      offset,
      order: orderClause
    });

    // Pagination info
    const pagination: Pagination = {
      current_page: parseInt(page),
      size_page: articles.length,
      max_page: Math.ceil(count / parseInt(limit)),
      total_data: count,
    };
    
    // Transform articles for API response
    const transformedArticles = articles.map(article => this.articleParsed(article));
    return { articles: transformedArticles, pagination };
  }

  /**
   * Creates a new article with the given author and data.
   * @param author_id Author's user ID
   * @param data Article creation DTO
   * @returns Parsed created article
   * @throws HttpException if file or categories not found
   */
  public async createArticle(author_id: number, data: CreateArticleDto): Promise<ArticleParsed> {
    // Find thumbnail file
    const thumbnail = await DB.Files.findOne({ attributes: ["pk"], where: { uuid: data.thumbnail }});
    if(!thumbnail) throw new HttpException(false, 404, "File is not found");
    
    // Find categories by UUIDs
    const categories = await DB.Categories.findAll({
      attributes: ["pk"],
      where: {
        uuid: { [Op.in]: data.categories }
      }
    })

    if (categories.length <= 0) {
      throw new HttpException(false, 404, "Categories is not found");
    }

    // Start transaction for atomic operation
    const transaction = await DB.sequelize.transaction();

    try {
      // Create article
      const article = await DB.Articles.create({
        title: data.title,
        description: data.description,
        content: data.content,
        thumbnail_id: thumbnail.pk,
        author_id
      }, { transaction});

      // Get category PKs
      const categoryIds = categories.map(category => category.pk);

      // Create article-category relations
      await DB.ArticlesCategories.bulkCreate(
        categoryIds.map(categoryId => ({
          article_id: article.pk,
          category_id: categoryId
        }), { transaction })
      );

      await transaction.commit();
      return this.getArticleById(article.uuid);
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }
  
  /**
   * Updates an article by UUID and author, with new data and categories.
   * @param article_id Article UUID
   * @param author_id Author's user ID
   * @param data Update DTO
   * @returns Parsed updated article
   * @throws HttpException if not found or invalid
   */
  public async updateArticle(article_id: string, author_id: number, data: UpdateArticleDto): Promise<ArticleParsed> {
    // Find article by UUID
    const article = await DB.Articles.findOne({ where: { uuid: article_id }});

    if(!article) {
      throw new HttpException(false, 400, "Article is not found");
    }
    
    const updatedData: any = {};
    
    // Update fields if provided
    if (data.title) updatedData.title = data.title;
    if (data.description) updatedData.description = data.description;
    if (data.content) updatedData.content = data.content;
    
    // Update thumbnail if provided
    if (data.thumbnail) {
      const file = await DB.Files.findOne({ 
        attributes: ["pk"], 
        where: { 
          uuid: data.thumbnail, 
          user_id: author_id 
        } 
      });
      
      if (!file) {
        throw new HttpException(false, 400, "File is not found");
      }
  
      updatedData.thumbnail = file.pk;
    }

    // Require at least one field to update
    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }

    // Start transaction for atomic update
    const transaction = await DB.sequelize.transaction();
    try {
      // Update categories if provided
      if (data.categories) {
        const categories = await DB.Categories.findAll({
          attributes: ["pk"],
          where: {
            uuid: { [Op.in]: data.categories }
          }
        });

        if (!categories || categories.length !== data.categories.length) {
          throw new HttpException(false, 400, "Some categories are not found or duplicated");
        }

        if (categories.length >= 0) {
          await DB.ArticlesCategories.destroy({
            where: { article_id: article.pk },
            force: true,
            transaction
          });

          const categoryIds = categories.map(category => category.pk);

          await DB.ArticlesCategories.bulkCreate(
            categoryIds.map(categoryId => ({
              article_id: article.pk,
              category_id: categoryId
            })), { transaction }
          );
        }
      }

      // Update article fields
      if (Object.keys(updatedData).length > 0) {
        await DB.Articles.update(updatedData, {
          where: { uuid: article_id },
          returning: true,
          transaction,
        });
      }

      await transaction.commit();

      return this.getArticleById(article.uuid);
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }

  /**
   * Deletes an article by UUID and author.
   * @param article_id Article UUID
   * @param author_id Author's user ID
   * @returns true if deleted
   * @throws HttpException if not found
   */
  public async deleteArticle(article_id: string, author_id: number): Promise<boolean> {
    // Find article by UUID and author
    const article = await DB.Articles.findOne({ where: { uuid: article_id, author_id }});

    if(!article) {
      throw new HttpException(false, 400, "Article is not found");
    }

    // Start transaction for atomic delete
    const transaction = await DB.sequelize.transaction();
    try {
      // Delete article
      await article.destroy({ transaction });

      // Delete article-category relations
      await DB.ArticlesCategories.destroy({ 
        where: { article_id: article.pk }, 
        transaction,
      })
      
      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error; 
    }
  }
}