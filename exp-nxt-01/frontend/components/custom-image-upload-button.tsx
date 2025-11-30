"use client";

import { useUploadThing } from "@/utils/uploadthing";
import {
  CheckCircle2,
  ExternalLink,
  ImageDownIcon,
  Loader2,
  LucideBluetoothSearching,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { Spinner } from "./ui/spinner";
import { cn } from "@/lib/utils";

interface Props {
  currentImage: string;
  onUploadComplete: (url: string) => void;
}
export function CustomImageUploadButton({
  currentImage,
  onUploadComplete,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;
    const filesArray = Array.from(files);
    const uploaded = await startUpload(filesArray);
    if (uploaded && uploaded[0].ufsUrl) {
      onUploadComplete(uploaded[0].ufsUrl);
    }
  };

  return (
    <div className="w-full">
      {!currentImage ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="relative w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div
            className={cn(
              "relative flex flex-col items-center justify-center gap-2 px-6 py-8 rounded-lg border-2 border-dashed transition-all duration-200",
              "border-gray-300 bg-gray-700/50 hover:border-gray-400 hover:bg-gray-500/50",
              isUploading && "cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-gray-200 animate-spin" />
                <span className="text-sm font-medium text-gray-700 mt-1">
                  <Spinner />
                </span>
              </>
            ) : (
              <>
                <div className="p-2.5 bg-white rounded-lg border border-gray-200 group-hover:border-gray-300 group-hover:bg-emerald-50 transition-all duration-200 shadow-sm">
                  <div className="text-gray-600 group-hover:text-gray-600 transition-colors">
                    <ImageDownIcon />
                  </div>
                </div>
                <div className="text-center mt-1">
                  <p className="text-sm font-medium text-gray-50">Blog Image</p>

                  <p className="text-xs text-gray-100 mt-1">Click to upload</p>
                </div>
              </>
            )}
          </div>
        </button>
      ) : (
        <div className="w-full border border-gray-200 bg-gray-500/30 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Thumbnail */}
            <div className="shrink-0">
              <div className="relative w-16 h-16 rounded-md overflow-hidden border border-emerald-200 bg-white shadow-sm">
                <Image
                  src={currentImage}
                  alt="Blog Image"
                  width={64}
                  height={64}
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info and Actions */}
            <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Blog Image
                  </p>
                  <p className="text-xs text-gray-500">Uploaded successfully</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => window.open(currentImage, "_blank")}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  View
                </button>

                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 px-2.5 py-1.5 rounded-md border border-gray-200 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Upload className="h-3 w-3" />
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
