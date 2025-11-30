import type { Request, Response } from "express";
import { editBlog } from "../../services/blogs/edit-blog.service";

export async function editBlogController(
  request: Request<
    {},
    {},
    {
      title?: string;
      content?: string;
      thumbnailUrl?: string;
      tags?: string[];
      authorId: string;
      blogId: string;
    }
  > & { user?: { id: string } },
  response: Response<{ success: boolean; message: string }>
) {
  const { title, content, thumbnailUrl, tags, authorId, blogId } = request.body;
  if (!blogId)
    return response
      .status(400)
      .json({ success: true, message: "Missing blog id." });
  if (!authorId)
    return response
      .status(401)
      .json({ success: false, message: "Missing author id." });
  const userId = request.user?.id;
  if (!userId || authorId !== userId)
    return response
      .status(400)
      .json({ success: false, message: "Not the same user." });

  try {
    const result = await editBlog(
      blogId,
      authorId,
      title,
      content,
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
