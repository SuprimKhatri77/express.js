import type { Request, Response } from "express";
import { deleteblog } from "../../services/blogs/delete-blog.service";

export async function deleteBlogController(
  request: Request<{}, {}, { blogId: string; authorId: string }> & {
    user?: { id: string };
  },
  response: Response<{ success: boolean; message: string }>
) {
  const { blogId, authorId } = request.body;
  if (!authorId || !blogId)
    return response
      .status(400)
      .json({ success: false, message: "Missing required credentials." });
  const userId = request.user?.id;
  if (!userId || authorId !== userId)
    return response
      .status(400)
      .json({ success: false, message: "Not the same user." });
  try {
    const result = await deleteblog(blogId, authorId);
    return response.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.log("error: ", error);
    return response
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
}
