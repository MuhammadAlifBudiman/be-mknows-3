import { File } from "@interfaces/file.interface";

export interface User {
  pk?: number;
  uuid?: string;
  
  full_name?: string;
  display_picture?: number | string;
  email: string;
  password?: string;
  email_verified_at?: Date;

  avatar?: File;
}

export interface UserQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  order?: string;
  sort?: string;
}

export interface UserParsed {
  uuid: string;

  full_name?: string;
  display_picture?: number | string;
  email: string;
}

export interface UserResponse extends Omit<User, "password"> {}