import { db } from "../../db";
import type { GetAllBlogsType } from "../../types/blog.types";

export async function getAllBlogs(authorId: string): Promise<GetAllBlogsType> {
  try {
    const allBlogs = await db.query.blogs.findMany({
      where: (fields, { eq }) => eq(fields.authorId, authorId),
    });
    return { success: true, blogs: allBlogs ?? [] };
  } catch (error) {
    console.log("error: ", error);
    return { success: false, message: "Something went wrong." };
  }
}
