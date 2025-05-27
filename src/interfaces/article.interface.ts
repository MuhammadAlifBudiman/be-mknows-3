import { Category } from "@interfaces/category.interface";

/**
 * Article interface represents the main structure of an article entity.
 * It includes primary key, UUID, title, description, content, thumbnail, author, and categories.
 */
export interface Article {
  /** Primary key of the article (database ID) */
  pk: number;
  /** Universally unique identifier for the article */
  uuid: string;

  /** Title of the article */
  title: string;
  /** Short description or summary of the article */
  description: string;
  /** Main content/body of the article */
  content: string;

  /** ID of the thumbnail image associated with the article */
  thumbnail_id: number;
  /** ID of the author who wrote the article */
  author_id: number;

  /** List of categories associated with the article */
  categories?: ArticleCategory[];
}

/**
 * ArticleCategory interface represents the relationship between an article and a category.
 */
export interface ArticleCategory {
  /** ID of the article */
  article_id: number;
  /** ID of the category */
  category_id: number;

  /** Category object containing category details */
  category: Category;
}

/**
 * ArticleQueryParams interface defines the possible query parameters for fetching articles.
 */
export interface ArticleQueryParams {
  /** Page number for pagination (as string) */
  page?: string;
  /** Limit of articles per page (as string) */
  limit?: string;
  /** Search keyword for filtering articles */
  search?: string;
  /** Field to order the results by */
  order?: string;
  /** Sort direction (asc/desc) */
  sort?: string;
}

/**
 * ArticleParsed interface represents a fully parsed article with resolved references.
 */
export interface ArticleParsed {
  /** UUID of the article */
  uuid: string;

  /** Title of the article */
  title: string;
  /** Description of the article */
  description: string;
  /** Content of the article */
  content: string;

  /** URL or path to the thumbnail image */
  thumbnail: string;

  /** Author details */
  author: {
    /** UUID of the author */
    uuid: string;
    /** Full name of the author */
    full_name: string;
    /** URL or path to the author's avatar image */
    avatar: string;
  },

  /** List of categories associated with the article */
  categories: Category[]
}