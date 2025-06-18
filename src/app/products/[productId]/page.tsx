"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { FETCH_TRAVEL_PRODUCT } from "@/graphql/queries/fetchTravelproduct";
import { FETCH_USER_LOGGED_IN } from "@/graphql/queries/fetchUserLoggedIn";
import { DELETE_TRAVEL_PRODUCT } from "@/graphql/mutations/deleteTravelproduct";
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
  const router = useRouter();

  const { data, loading, error } = useQuery(FETCH_TRAVEL_PRODUCT, {
    variables: { travelproductId: productId },
  });

  const { data: userData } = useQuery(FETCH_USER_LOGGED_IN);

  const [deleteTravelproduct] = useMutation(DELETE_TRAVEL_PRODUCT, {
    refetchQueries: [
      {
        query: FETCH_TRAVEL_PRODUCT,
        variables: { travelproductId: productId },
      },
    ],
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
  const currentUser = userData?.fetchUserLoggedIn;
  const isSold = !!product.soldAt;
  const isAuthor = currentUser?._id === product.seller?._id;

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
    setBookmarkCount((prev) => (isBookmarked ? prev - 1 : prev + 1));
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteTravelproduct({
          variables: { travelproductId: productId },
        });
        router.push("/products");
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const handleEdit = () => {
    router.push(`/products/${productId}/edit`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 캐러셀과 카드 영역을 가로로 배치 */}
      <div className="flex gap-5 mb-6">
        {/* 캐러셀 영역 */}
        <div className="w-3/4 h-120">
          <Carousel className="w-full h-full rounded-lg overflow-hidden">
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
                    height={320}
                    className="object-cover w-full h-full"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* 카드 영역 */}
        <div className="w-1/5">
          {isAuthor ? (
            // 작성자인 경우: 삭제/수정 버튼
            <div className="bg-gray-50 rounded-lg p-5 flex flex-col gap-3">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
              >
                삭제하기
              </Button>
              <Button className="w-full" onClick={handleEdit}>
                수정하기
              </Button>
            </div>
          ) : (
            // 작성자가 아닌 경우: 구매 카드

            <div className="bg-gray-50 rounded-lg p-5 flex flex-col items-start min-w-[200px]">
              <div className="text-xl font-semibold mb-2">
                {product.price.toLocaleString()}원
              </div>
              <Button className="w-full" disabled={isSold}>
                {isSold ? "판매완료" : "구매하기"}
              </Button>
            </div>
          )}

          {/* 북마크 버튼  */}
          <button
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition mt-4"
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
      </div>

      {/* 제목/부제목 */}
      <div className="mb-2 flex flex-col gap-1">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-gray-600">{product.remarks}</p>
      </div>

      {/* 본문 */}
      <div className="mb-6">
        <div
          className="text-base leading-relaxed text-gray-800 whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(product.contents),
          }}
        />
      </div>

      {/* 상세 정보 카드 */}
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

      {/* 지도 (임시) */}
      {/* <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-8">
        <span className="text-gray-400">
          [지도 영역] {product.travelproductAddress?.address}
        </span>
      </div> */}
    </div>
  );
}
