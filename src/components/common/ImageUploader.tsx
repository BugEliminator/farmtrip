import React, { useRef } from "react";
import Image from "next/image";
import { CircleX, ImagePlus } from "lucide-react";
import { useMutation } from "@apollo/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  uploadFileMutation: any; // DocumentNode (GraphQL mutation)
  storagePrefix?: string; // ex: https://storage.googleapis.com/
  multiple?: boolean;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  uploadFileMutation,
  storagePrefix = "https://storage.googleapis.com/",
  multiple = false,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, { loading }] = useMutation(uploadFileMutation);

  // 이미지 업로드
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = multiple ? Array.from(files) : [files[0]];
    try {
      const uploaded: string[] = [];
      for (const file of fileList) {
        const { data } = await uploadFile({ variables: { file } });
        if (data?.uploadFile?.url) {
          uploaded.push(data.uploadFile.url);
        } else {
          alert("이미지 업로드 실패");
        }
      }
      if (uploaded.length > 0) {
        onChange([...images, ...uploaded]);
      }
    } catch (err) {
      alert("이미지 업로드 실패");
      console.error("이미지 업로드 에러:", err);
    }
  };

  // 이미지 삭제
  const handleRemoveImage = (url: string) => {
    onChange(images.filter((img) => img !== url));
  };

  return (
    <div>
      <div className="flex gap-4 flex-wrap">
        {images.map((url) => (
          <div
            key={url}
            className="relative group w-32 h-32 rounded overflow-hidden border"
          >
            <Image
              src={url.startsWith("http") ? url : `${storagePrefix}${url}`}
              alt="업로드 이미지"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
            <Button
              type="button"
              onClick={() => handleRemoveImage(url)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={disabled}
            >
              <CircleX size={20} />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-32 h-32 flex flex-col items-center justify-center border rounded bg-gray-50 hover:bg-gray-100"
          disabled={disabled || loading}
        >
          <ImagePlus size={32} />
          <span className="text-sm mt-2">클릭해서 사진 업로드</span>
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            multiple={multiple}
            disabled={disabled || loading}
          />
        </Button>
      </div>
      {loading && (
        <div className="text-sm text-gray-500 mt-2">업로드 중...</div>
      )}
    </div>
  );
};
