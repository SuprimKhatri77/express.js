import z from "zod";

export const blogSchema = z.object({
  title: z.string().trim().nonempty(),
  content: z.string().trim().nonempty(),
  thumbnailUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const createBlogSchema = blogSchema;

export const editBlogSchema = blogSchema.partial();
