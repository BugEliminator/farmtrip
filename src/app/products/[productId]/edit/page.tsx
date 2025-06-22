"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { FETCH_TRAVEL_PRODUCT } from "@/graphql/queries/fetchTravelproduct";
import { UPDATE_TRAVEL_PRODUCT } from "@/graphql/mutations/updateTravelproduct";
import { UPLOAD_FILE } from "@/graphql/mutations/uploadFile";
import { CircleX, ImagePlus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ProductEditPage() {
  const router = useRouter();
  const { productId } = useParams();
  const { data, loading: queryLoading } = useQuery(FETCH_TRAVEL_PRODUCT, {
    variables: { travelproductId: productId },
    skip: !productId,
  });
  const [name, setName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [contents, setContents] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [updateTravelproduct, { loading: updateLoading }] = useMutation(
    UPDATE_TRAVEL_PRODUCT
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 기존 값 세팅
  useEffect(() => {
    if (data?.fetchTravelproduct) {
      setName(data.fetchTravelproduct.name || "");
      setRemarks(data.fetchTravelproduct.remarks || "");
      setContents(data.fetchTravelproduct.contents || "");
      setPrice(data.fetchTravelproduct.price?.toString() || "");
      setImages(data.fetchTravelproduct.images || []);
    }
  }, [data]);

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

  // 수정
  const handleSubmit = async () => {
    if (!name || !remarks || !contents || !price) {
      alert("모든 필수 항목을 입력해 주세요.");
      return;
    }
    try {
      await updateTravelproduct({
        variables: {
          updateTravelproductInput: {
            name,
            remarks,
            contents,
            price: Number(price),
            tags,
            images,
          },
          travelproductId: productId,
        },
      });
      alert("수정 완료!");
      router.push(`/products/${productId}`);
    } catch (err) {
      alert("수정 실패");
      console.error("수정 에러:", err);
    }
  };

  if (queryLoading) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-6">상품 수정하기</h2>
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
          disabled={updateLoading || !name || !remarks || !contents || !price}
        >
          수정하기
        </Button>
      </div>
    </div>
  );
}
