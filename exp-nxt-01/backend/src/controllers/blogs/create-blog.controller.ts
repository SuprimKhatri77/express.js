import type { Request, Response } from "express";
import { createBlog } from "../../services/blogs/create-blog.service";

export async function createBlogController(
  request: Request<
    {},
    {},
    {
      title: string;
      content: string;
      thumbnailUrl?: string;
      tags?: string[];
      authorId: string;
    }
  > & { user?: { id: string } },
  response: Response
) {
  console.log("i got triggered");
  const { title, content, thumbnailUrl, tags, authorId } = request.body;
  const userId = request.user?.id;
  console.log("userId: ", userId);
  console.log("authorId: ", authorId);
  if (!userId)
    return response
      .status(401)
      .json({ success: false, message: "User not authenticated" });
  if (authorId !== userId)
    return response
      .status(403)
      .json({ success: false, message: "Not the same user" });

  try {
    const result = await createBlog(
      title,
      content,
      authorId,
      thumbnailUrl,
      tags
    );
    return response.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.log("error: ", error);
    return response
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
}
