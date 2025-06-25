"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { UPLOAD_FILE } from "@/graphql/mutations/uploadFile";
import { CREATE_TRAVEL_PRODUCT } from "@/graphql/mutations/(product)/createTravelproduct";
import { Form, FieldConfig } from "@/components/common/Form";
import { ImageUploader } from "@/components/common/ImageUploader";
import { Button } from "@/components/ui/button";

export default function ProductWritePage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [createTravelproduct, { loading }] = useMutation(CREATE_TRAVEL_PRODUCT);

  // 태그 자동 주입
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const tags = pathname.startsWith("/products")
    ? ["products"]
    : pathname.startsWith("/experiences")
    ? ["experiences"]
    : [];

  // fields 배열 정의
  const fields: FieldConfig[] = [
    {
      name: "name",
      label: "상품명",
      type: "text",
      required: true,
      placeholder: "상품명을 입력해 주세요.",
    },
    {
      name: "remarks",
      label: "한줄 요약",
      type: "text",
      required: true,
      placeholder: "상품을 한줄로 요약해 주세요.",
    },
    {
      name: "contents",
      label: "상품 설명",
      type: "textarea",
      required: true,
      placeholder: "상품 설명을 입력해 주세요.",
    },
    {
      name: "price",
      label: "판매 가격",
      type: "number",
      required: true,
      placeholder: "판매 가격을 입력해 주세요.",
    },
  ];

  // 등록
  const handleSubmit = async (values: Record<string, any>) => {
    const { name, remarks, contents, price } = values;
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
      <Form
        type="product"
        fields={fields}
        onSubmit={handleSubmit}
        submitText="등록하기"
      >
        <div className="mb-6">
          <label className="block font-semibold mb-1">사진 첨부</label>
          <ImageUploader
            images={images}
            onChange={setImages}
            uploadFileMutation={UPLOAD_FILE}
          />
        </div>
      </Form>
      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          onClick={() => router.back()}
          className="bg-white text-black border border-gray-300 hover:bg-white hover:text-black hover:border-gray-300 shadow-sm"
        >
          취소
        </Button>
      </div>
    </div>
  );
}
