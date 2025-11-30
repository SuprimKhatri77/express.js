import type { BlogSelectType } from "../db/schema";

export type CreateBlogType = {
  success: boolean;
  message: string;
  errors?: {
    properties?: {
      title?: string[];
      content?: string[];
      thumbnailUrl?: string[];
      tags?: string[];
    };
  };
  inputs?: {
    title: string;
    content: string;
    thumbnailUrl?: string;
    tags?: string[];
  };
  authorId?: string;
};
export type EditBlogType = {
  success: boolean;
  message: string;
  errors?: {
    properties?: {
      title?: string[];
      content?: string[];
      thumbnailUrl?: string[];
      tags?: string[];
    };
  };
  blogId?: string;
  inputs?: {
    title?: string;
    content?: string;
    thumbnailUrl?: string;
    tags?: string[];
  };
  authorId?: string;
};

export type DeleteBlogType = {
  success: boolean;
  message: string;
};

export type GetAllBlogsType =
  | { success: true; blogs: BlogSelectType[] | [] }
  | { success: false; message: string };
