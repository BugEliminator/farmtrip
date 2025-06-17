"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CircleX, ImagePlus } from "lucide-react";
import { UPLOAD_FILE } from "@/graphql/mutations/uploadFile";
import { CREATE_TRAVEL_PRODUCT } from "@/graphql/mutations/createTravelproduct";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ProductWritePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [contents, setContents] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [createTravelproduct, { loading }] = useMutation(CREATE_TRAVEL_PRODUCT);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 태그 자동 주입
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const tags = pathname.startsWith("/products")
    ? ["products"]
    : pathname.startsWith("/experiences")
    ? ["experiences"]
    : [];

  // 이미지 업로드
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { data } = await uploadFile({ variables: { file } });
      if (data?.uploadFile?.url) {
        setImages((prev) => [...prev, data.uploadFile.url]);
      } else {
        alert("이미지 업로드 실패");
        console.error("업로드 응답 오류:", data);
      }
    } catch (err) {
      alert("이미지 업로드 실패");
      console.error("이미지 업로드 에러:", err);
    }
  };

  // 이미지 삭제
  const handleRemoveImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  // 등록
  const handleSubmit = async () => {
    if (!name || !remarks || !contents || !price) {
      alert("모든 필수 항목을 입력해 주세요.");
      return;
    }
    try {
      await createTravelproduct({
        variables: {
          createTravelproductInput: {
            name,
            remarks,
            contents,
            price: Number(price),
            tags,
            images,
          },
        },
      });
      alert("등록 완료!");
      router.push("/products");
    } catch (err) {
      alert("등록 실패");
      console.error("등록 에러:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-6">상품 판매하기</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          상품명 <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="상품명을 입력해 주세요."
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          한줄 요약 <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border rounded px-3 py-2"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="상품을 한줄로 요약해 주세요."
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          상품 설명 <span className="text-red-500">*</span>
        </label>
        <Textarea
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          placeholder="상품 설명을 입력해 주세요."
          className="min-h-[150px]"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          판매 가격 <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="판매 가격을 입력해 주세요."
          min={0}
        />
      </div>
      {/* <div className="mb-4">
        <label className="block font-semibold mb-1">태그</label>
        <input
          className="w-full border rounded px-3 py-2 bg-gray-100"
          value={tags.join(", ")}
          readOnly
        />
      </div> */}
      {/* <div className="mb-4">
        <label className="block font-semibold mb-1">주소</label>
        <div className="flex gap-2 mb-2">
          <input
            className="w-24 border rounded px-2 py-1"
            placeholder="01234"
            disabled
          />
          <button className="border rounded px-2 py-1 bg-gray-100" disabled>
            우편번호 검색
          </button>
        </div>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="상세주소를 입력해 주세요."
          disabled
        />
        <div className="flex gap-2">
          <input
            className="w-1/2 border rounded px-3 py-2"
            placeholder="위도(LAT)"
            disabled
          />
          <input
            className="w-1/2 border rounded px-3 py-2"
            placeholder="경도(LNG)"
            disabled
          />
        </div>
      </div> */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">사진 첨부</label>
        <div className="flex gap-4">
          {images.map((url) => (
            <div
              key={url}
              className="relative group w-32 h-32 rounded overflow-hidden border"
            >
              <Image
                src={`https://storage.googleapis.com/${url}`}
                alt="업로드 이미지"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(url)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CircleX size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 flex flex-col items-center justify-center border rounded bg-gray-50 hover:bg-gray-100"
          >
            <ImagePlus size={32} />
            <span className="text-sm mt-2">클릭해서 사진 업로드</span>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          onClick={() => router.back()}
          className="bg-white text-black border border-gray-300 hover:bg-white hover:text-black hover:border-gray-300 shadow-sm"
        >
          취소
        </Button>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !name || !remarks || !contents || !price}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
}
