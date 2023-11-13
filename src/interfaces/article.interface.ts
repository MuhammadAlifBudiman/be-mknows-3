import { Category } from "@interfaces/category.interface";

export interface Article {
  pk: number;
  uuid: string;

  title: string;
  description: string;
  content: string;

  thumbnail_id: number;
  author_id: number;

  categories?: ArticleCategory[];
}

export interface ArticleCategory {
  article_id: number;
  category_id: number;

  category: Category;
}

export interface ArticleQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  order?: string;
  sort?: string;
}

export interface ArticleParsed {
  uuid: string;

  title: string;
  description: string;
  content: string;

  thumbnail: string;

  author: {
    uuid: string;
    full_name: string;
    avatar: string;
  },

  categories: Category[]
}