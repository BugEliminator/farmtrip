"use client";
import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { FETCH_TRAVEL_PRODUCT } from "@/graphql/queries/(product)/fetchTravelproduct";
import { UPDATE_TRAVEL_PRODUCT } from "@/graphql/mutations/(product)/updateTravelproduct";
import { UPLOAD_FILE } from "@/graphql/mutations/uploadFile";
import { Form, FieldConfig } from "@/components/common/Form";
import { ImageUploader } from "@/components/common/ImageUploader";
import { Button } from "@/components/ui/button";

export default function ProductEditPage() {
  const router = useRouter();
  const { productId } = useParams();
  const { data, loading: queryLoading } = useQuery(FETCH_TRAVEL_PRODUCT, {
    variables: { travelproductId: productId },
    skip: !productId,
  });
  const [images, setImages] = useState<string[]>([]);
  const [updateTravelproduct, { loading: updateLoading }] = useMutation(
    UPDATE_TRAVEL_PRODUCT
  );

  // 기존 값 세팅 (초기값)
  const initialValues = useMemo(() => {
    if (!data?.fetchTravelproduct) return {};
    return {
      name: data.fetchTravelproduct.name || "",
      remarks: data.fetchTravelproduct.remarks || "",
      contents: data.fetchTravelproduct.contents || "",
      price: data.fetchTravelproduct.price?.toString() || "",
    };
  }, [data]);

  // images 초기값 동기화
  useMemo(() => {
    if (data?.fetchTravelproduct?.images) {
      setImages(data.fetchTravelproduct.images);
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

  // 수정
  const handleSubmit = async (values: Record<string, any>) => {
    const { name, remarks, contents, price } = values;
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
      <Form
        type="product"
        fields={fields}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        submitText="수정하기"
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
