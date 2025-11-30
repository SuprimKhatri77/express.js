"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { BlogsSelectType } from "@/types/blogs.types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

type Props = {
  userId: string;
  sessionToken: string;
};
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export function Blogs({ userId, sessionToken }: Props) {
  console.log("userId: ", userId);
  const { data: blogs, isPending } = useQuery<BlogsSelectType[]>({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/users/${userId}/blogs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `better-auth.session_token=${sessionToken}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to get blogs.");
      const data = await res.json();
      if (!data.success || !data.blogs) return null;
      return data.blogs;
    },

    staleTime: 1000 * 60 * 60,
  });
  return (
    <div className="py-2 px-5 flex flex-col gap-7">
      <h1>All blogs</h1>
      <Link href="/dashboard">
        <Button variant="outline">Go to Dashboard</Button>
      </Link>
      {isPending ? (
        <Spinner />
      ) : (
        blogs &&
        (blogs.length > 0 ? (
          <div className="flex flex-col gap-5 ">
            {blogs.map((blog: BlogsSelectType) => (
              <div key={blog.id} className="bg-violet-400 rounded-lg py-2 px-5">
                <h1>{blog.title}</h1>
                <p>{blog.content}</p>
                {blog.thumbnailUrl && (
                  <Image
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    width={200}
                    height={200}
                  />
                )}
                <span>{blog.tags}</span>
                {blog.createdAt && (
                  <div>
                    <p>
                      {" "}
                      Created At: {new Date(blog.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h1>No, Blogs found.</h1>
          </div>
        ))
      )}
    </div>
  );
}
