import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  onTagChange: (tags: string[]) => void;
  tags: string[];
};
export function AddTags({ tags, onTagChange }: Props) {
  const [tag, setTag] = useState<string>("");
  const [tagsList, setTagsList] = useState<string[]>([]);

  const handleAdd = () => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed)) return;

    onTagChange([...tags, trimmed]);

    setTag("");
  };

  const handleRemove = (tag: string) => {
    onTagChange(tags.filter((p) => p !== tag));
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2 ">
        {tags.length > 0 &&
          tags.map((tag, idx) => (
            <div
              key={`${tag}-${idx}`}
              className="bg-black text-white py-1 px-3 rounded-full"
            >
              <div className="flex items-center gap-1 justify-between">
                <p>{tag}</p>
                <XIcon
                  onClick={() => handleRemove(tag)}
                  size={20}
                  className="hover:bg-slate-50 hover:text-black rounded-full"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
