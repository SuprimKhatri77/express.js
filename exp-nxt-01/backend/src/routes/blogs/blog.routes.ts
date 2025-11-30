import { Router } from "express";
import { getCurrentUser } from "../../middlewares/get-current-user";
import { createBlogController } from "../../controllers/blogs/create-blog.controller";
import { editBlogController } from "../../controllers/blogs/edit-blog.controller";
import { deleteBlogController } from "../../controllers/blogs/delete-blog.controller";
import { getAllBlogsController } from "../../controllers/blogs/get-all-blogs.controller";

const router = Router();

router.post("/create-blog", getCurrentUser, createBlogController);
router.patch("/edit-blog", getCurrentUser, editBlogController);
router.delete("/delete-blog", getCurrentUser, deleteBlogController);
router.get("/users/:userId/blogs", getCurrentUser, getAllBlogsController);

export default router;
