"use client";

import { useMutation } from "@tanstack/react-query";

import { CustomImageUploadButton } from "@/components/custom-image-upload-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { AddTags } from "./add-tags";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
type APIResponse =
  | { success: true; message: string }
  | { success: false; message: string };

type Props = {
  open: boolean;
  onOpenChange: (bool: boolean) => void;
  sessionToken: string | null;
  userId: string;
};
export function CreateBlogDialog({
  userId,
  open,
  onOpenChange,
  sessionToken,
}: Props) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const title = formData.get("title");
      const content = formData.get("content");
      const thumbnailUrl = formData.get("thumbnailUrl") ?? null;
      const allTags = tags ?? null;

      const res = await fetch(`${API_URL}/api/create-blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `better-auth.session_token=${sessionToken}`,
        },
        body: JSON.stringify({
          title,
          content,
          thumbnailUrl,
          tags: allTags,
          authorId: userId,
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create the blog.");
      const data = await res.json();
      return data;
    },
    onSuccess: (res: APIResponse) => {
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      onOpenChange(false);
    },
    onError: (err) => {
      console.log("error: ", err);
      toast.error("Something went wrong.");
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate(formData);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Create blog</DialogTitle>
            <DialogDescription>
              Create a new blog and add it your blog list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field className="grid gap-3">
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input id="title" name="title" />
            </Field>
            <Field className="grid gap-3">
              <FieldLabel htmlFor="content">Content</FieldLabel>
              <Textarea id="content" name="content" />
            </Field>
            <Field>
              <FieldLabel htmlFor="thumbnailImage">Thumbnail Image</FieldLabel>
              <CustomImageUploadButton
                currentImage={uploadedImageUrl}
                onUploadComplete={setUploadedImageUrl}
              />
              <input
                type="hidden"
                name="thumbnailUrl"
                value={uploadedImageUrl}
              />
            </Field>
            <Field>
              <FieldLabel>Tags</FieldLabel>
              <AddTags tags={tags} onTagChange={setTags} />
            </Field>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Create"}
            </Button>
          </DialogFooter>
          {tags.map((t, idx) => (
            <input key={`${t}-${idx}`} type="hidden" name="tags" value={t} />
          ))}
          <input type="hidden" name="authorId" value={userId} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
