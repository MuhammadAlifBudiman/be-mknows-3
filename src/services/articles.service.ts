import { Service } from "typedi";
import { DB } from "@database";

import { ArticleModel } from "@models/articles.model";

import { Article, ArticleParsed, ArticleQueryParams } from "@interfaces/article.interface";
import { Pagination } from "@interfaces/common/pagination.interface";
import { CreateArticleDto, UpdateArticleDto } from "@dtos/articles.dto";
import { HttpException } from "@exceptions/HttpException";
import { Op } from "sequelize";

@Service()
export class ArticleService {
  private articleParsed(article: ArticleModel): ArticleParsed {
    return {
      uuid: article.uuid,
      title: article.title,
      description: article.description,
      content: article.content,

      thumbnail: article.thumbnail?.uuid, 
      author: {
        uuid: article.author.uuid,
        full_name: article.author.full_name || null,
        avatar: article.author.avatar?.uuid || null, 
      }
    };
  }

  public async getArticles(query: ArticleQueryParams): Promise<{ articles: ArticleParsed[], pagination: Pagination }> {
    const { page = "1", limit = "10", search, order, sort } = query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

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
    
    if (order && sort) {
      if (sort === "asc" || sort === "desc") {
        orderClause.push([order, sort]);
      }
    }

    const { rows: articles, count } = await DB.Articles.findAndCountAll({ 
      where,
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ["pk"] },
      order: orderClause
    });

    const pagination: Pagination = {
      current_page: parseInt(page),
      size_page: articles.length,
      max_page: Math.ceil(count / parseInt(limit)),
      total_data: count,
    };

    const transformedArticles = articles.map(article => this.articleParsed(article));
    return { articles: transformedArticles, pagination };
  }

  public async createArticle(author_id: number, data: CreateArticleDto): Promise<Article> {
    const thumbnail = await DB.Files.findOne({ attributes: ["pk"], where: { uuid: data.thumbnail }});
    if(!thumbnail) throw new HttpException(false, 404, "File is not found");
    
    const article = await DB.Articles.create({ ...data, thumbnail_id: thumbnail.pk, author_id });
    return article;
  }
  
  public async updateArticle(article_id: string, author_id: number, data: UpdateArticleDto): Promise<ArticleParsed> {
    const article = await DB.Articles.findOne({ where: { uuid: article_id }});

    if(!article) {
      throw new HttpException(false, 400, "Article is not found");
    }
    
    const updatedData: any = {};
    
    if (data.title) updatedData.title = data.title;
    if (data.description) updatedData.description = data.description;
    if (data.content) updatedData.content = data.content;
    
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

    if (Object.keys(updatedData).length === 0) {
      throw new HttpException(false, 400, "Some field is required");
    }

    article.update(updatedData);

    await article.save();
    
    const response = this.articleParsed(article);
    return response;
  }

  public async deleteArticle(article_id: string, author_id: number): Promise<boolean> {
    const article = await DB.Articles.findOne({ where: { uuid: article_id, author_id }});

    if(!article) {
      throw new HttpException(false, 400, "Article is not found");
    }

    await article.destroy(); // Untuk Permanent Delete: await article.destroy({ force: true });
    return true;
  }
}