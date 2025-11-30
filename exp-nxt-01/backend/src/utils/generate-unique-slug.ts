import { eq } from "drizzle-orm";
import { db } from "../db";
import { blogs } from "../db/schema";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
export async function generateUniqueSlug(title: string) {
  const base = toSlug(title);
  let slug = base;
  let count = 1;
  while (true) {
    const exisitng = await db
      .select({ slug: blogs.slug })
      .from(blogs)
      .where(eq(blogs.slug, slug))
      .limit(1);
    if (exisitng.length === 0) return slug;
    count++;
    slug = `${base}-${count}`;
  }
}
