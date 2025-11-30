import z from "zod";
import { editBlogSchema } from "../../schemas/blog.schema";
import type { EditBlogType } from "../../types/blog.types";
import { db } from "../../db";
import { blogs } from "../../db/schema";
import { and, DrizzleError, eq } from "drizzle-orm";

export async function editBlog(
  blogId: string,
  authorId: string,
  title?: string,
  content?: string,
  thumbnailUrl?: string,
  tags?: string[]
): Promise<EditBlogType> {
  const validateFields = editBlogSchema.safeParse({
    title,
    content,
    thumbnailUrl,
    tags,
  });

  if (!validateFields.success) {
    const tree = z.treeifyError(validateFields.error).properties;
    return {
      success: false,
      message: "Validato failed.",
      inputs: { title, content, thumbnailUrl, tags },
      errors: {
        properties: {
          title: tree?.title?.errors,
          content: tree?.content?.errors,
          thumbnailUrl: tree?.thumbnailUrl?.errors,
          tags: tree?.tags?.errors,
        },
      },
    };
  }
  const data = validateFields.data;
  try {
    const [blogRecord] = await db
      .select()
      .from(blogs)
      .where(and(eq(blogs.id, blogId), eq(blogs.authorId, authorId)));
    if (!blogRecord) {
      return {
        success: false,
        message: "Blog record not found.",
        inputs: { title, content, thumbnailUrl, tags },
      };
    }
    if (
      blogRecord.tags === data.tags &&
      blogRecord.title === data.title &&
      blogRecord.content === data.content &&
      blogRecord.thumbnailUrl === data.thumbnailUrl
    ) {
      return {
        success: false,
        message: "No changes detected",
      };
    }

    await db
      .update(blogs)
      .set({
        title: data.title,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl,
        tags: data.tags,
      })
      .where(and(eq(blogs.id, blogId), eq(blogs.authorId, authorId)));
    return {
      success: true,
      message: "Blog updated successfully.",
    };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof DrizzleError) {
      console.log("error message: ", error.message);
      return {
        success: false,
        message: error.message,
        inputs: { title, content, thumbnailUrl, tags },
      };
    }
    return {
      success: false,
      message: "Something went wrong.",
      inputs: { title, content, thumbnailUrl, tags },
    };
  }
}
