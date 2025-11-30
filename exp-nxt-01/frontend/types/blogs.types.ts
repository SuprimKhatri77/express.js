export type BlogsSelectType = {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  title: string;
  slug: string;
  content: string;
  authorId: string;
  thumbnailUrl: string | null;
  tags: string[] | null;
};
