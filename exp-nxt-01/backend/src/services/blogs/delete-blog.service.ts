import { and, DrizzleError, eq } from "drizzle-orm";
import { db } from "../../db";
import { blogs } from "../../db/schema";
import type { DeleteBlogType } from "../../types/blog.types";

export async function deleteblog(
  blogId: string,
  authorId: string
): Promise<DeleteBlogType> {
  try {
    const [blogRecord] = await db
      .select()
      .from(blogs)
      .where(and(eq(blogs.id, blogId), eq(blogs.authorId, authorId)));
    if (!blogRecord)
      return { success: false, message: "Blog record not found." };
    await db
      .delete(blogs)
      .where(and(eq(blogs.id, blogId), eq(blogs.authorId, authorId)));
    return { success: true, message: "Blog deleted successfully." };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof DrizzleError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong." };
  }
}
