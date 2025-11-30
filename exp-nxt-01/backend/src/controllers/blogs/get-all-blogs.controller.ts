import type { Request, Response } from "express";
import { getAllBlogs } from "../../services/blogs/get-all-blogs.service";

export async function getAllBlogsController(
  request: Request<{ userId: string }, {}, {}> & {
    user?: { id: string };
  },
  response: Response
) {
  console.log("incoming request to get blogs");

  const { userId } = request.params;
  console.log("userid from params: ", userId);
  const currentUserId = request.user?.id;
  console.log("curr user id from middleware: ", currentUserId);
  if (!userId)
    return response
      .status(400)
      .json({ success: false, message: "Missing user id." });
  if (!currentUserId || userId !== currentUserId)
    return response
      .status(400)
      .json({ success: false, message: "Not the same user." });
  try {
    console.log("fetching the blog now");
    const result = await getAllBlogs(userId);
    return response.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.log("error: ", error);
    return response
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
}
