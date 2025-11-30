import z from "zod";
import type { CreateBlogType } from "../../types/blog.types";
import { db } from "../../db";
import { blogs, type BlogInsertType } from "../../db/schema";
import { generateUniqueSlug } from "../../utils/generate-unique-slug";
import { DrizzleError } from "drizzle-orm";
import { createBlogSchema } from "../../schemas/blog.schema";

export async function createBlog(
  title: string,
  content: string,
  authorId: string,
  thumbnailUrl?: string,
  tags?: string[]
): Promise<CreateBlogType> {
  if (!authorId) return { success: false, message: "Missing the author id." };

  const validateFields = createBlogSchema.safeParse({
    title,
    content,
    thumbnailUrl,
    tags,
  });

  if (!validateFields.success) {
    const tree = z.treeifyError(validateFields.error).properties;
    return {
      success: false,
      message: "Validation failed.",
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
    const slug = await generateUniqueSlug(data.title);
    await db.insert(blogs).values({
      title: data.title,
      content: data.content,
      authorId,
      thumbnailUrl: data.thumbnailUrl ? thumbnailUrl : null,
      tags: data.tags ? data.tags : null,
      slug,
    } satisfies BlogInsertType);
    return { success: true, message: "Blog created successfully." };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof DrizzleError) {
      console.log("error message: ", error.message);
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong." };
  }
}
