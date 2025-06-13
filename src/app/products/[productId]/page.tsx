"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { FETCH_TRAVEL_PRODUCT } from "@/graphql/queries/fetchTravelproduct";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import dayjs from "dayjs";
import DOMPurify from "dompurify";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { data, loading, error } = useQuery(FETCH_TRAVEL_PRODUCT, {
    variables: { travelproductId: productId },
  });

  console.log(data);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    if (data?.fetchTravelproduct) {
      setBookmarkCount(data.fetchTravelproduct.pickedCount || 0);
      setIsBookmarked(false);
    }
  }, [data]);

  if (loading) return <div className="p-8">로딩 중...</div>;
  if (error)
    return <div className="p-8 text-red-500">에러가 발생했습니다.</div>;

  const product = data.fetchTravelproduct;
  const isSold = !!product.soldAt;

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
    setBookmarkCount((prev) => (isBookmarked ? prev - 1 : prev + 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 1. 캐러셀 */}
      <Carousel className="w-full aspect-[3/1] rounded-lg overflow-hidden mb-6">
        <CarouselContent>
          {(product.images && product.images.length > 0
            ? product.images
            : ["/placeholder.png"]
          ).map((img: string, idx: number) => (
            <CarouselItem key={idx}>
              <Image
                src={`https://storage.googleapis.com/${img}`}
                alt={`product-image-${idx}`}
                width={900}
                height={300}
                className="object-cover w-full h-64"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* 2. 제목/부제목 */}
      <div className="mb-2 flex flex-col gap-1">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-gray-600">{product.remarks}</p>
      </div>

      {/* 3. 본문 */}
      <div className="mb-6">
        <div
          className="text-base leading-relaxed text-gray-800 whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.contents),
          }}
        />
      </div>

      {/* 4. 가격 & 북마크 */}
      <div className="flex items-center justify-between mb-8">
        <div className="bg-gray-50 rounded-lg p-5 flex flex-col items-start min-w-[200px]">
          <div className="text-xl font-semibold mb-2">
            {product.price.toLocaleString()}원
          </div>
          <Button className="w-full" disabled={isSold}>
            {isSold ? "판매완료" : "구매하기"}
          </Button>
        </div>
        <button
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition"
          onClick={handleBookmark}
        >
          <Heart
            size={28}
            fill={isBookmarked ? "#ef4444" : "none"}
            stroke={isBookmarked ? "#ef4444" : "currentColor"}
          />
          <span className="text-lg">{bookmarkCount}</span>
        </button>
      </div>

      {/* 5. 상세 정보 카드 */}
      <div className="bg-white rounded-lg shadow p-5 mb-8">
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <div>
            <span className="font-semibold">판매자</span> :{" "}
            {product.seller?.name}
          </div>
          <div>
            <span className="font-semibold">주소</span> :{" "}
            {product.travelproductAddress?.address}
          </div>
          <div>
            <span className="font-semibold">등록일</span> :{" "}
            {dayjs(product.createdAt).format("YYYY-MM-DD")}
          </div>
          <div>
            <span className="font-semibold">판매상태</span> :{" "}
            {isSold ? "판매완료" : "판매중"}
          </div>
          {isSold && (
            <div>
              <span className="font-semibold">판매완료일</span> :{" "}
              {dayjs(product.soldAt).format("YYYY-MM-DD")}
            </div>
          )}
        </div>
      </div>

      {/* 6. 지도 (임시) */}
      {/* <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-8">
        <span className="text-gray-400">
          [지도 영역] {product.travelproductAddress?.address}
        </span>
      </div> */}

      {/* 7. Q&A */}
      {/* <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Questions & Answers</h3>
        <div className="flex flex-col gap-6">
          {mockQnA.map((q) => (
            <div key={q.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Image
                  src={q.user.picture}
                  alt={q.user.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <span className="font-semibold">{q.user.name}</span>
                <span className="text-xs text-gray-400">{q.createdAt}</span>
              </div>
              <div className="mb-2">{q.content}</div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-blue-500">
                  👍 <span>{q.likes}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-red-500">
                  👎 <span>{q.dislikes}</span>
                </button>
              </div>
              {q.answers.map((a) => (
                <div
                  key={a.id}
                  className="mt-4 pl-6 border-l-2 border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Image
                      src={a.user.picture}
                      alt={a.user.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="font-semibold">{a.user.name}</span>
                    <span className="text-xs text-gray-400">{a.createdAt}</span>
                  </div>
                  <div className="mb-2">{a.content}</div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-blue-500">
                      👍 <span>{a.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-red-500">
                      👎 <span>{a.dislikes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <Button>질문하기</Button>
        </div>
      </div> */}
    </div>
  );
}
