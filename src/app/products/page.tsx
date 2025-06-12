"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { FETCH_TRAVEL_PRODUCTS } from "@/graphql/queries/fetchTravelproducts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Pencil, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const { loading, fetchMore, refetch, data } = useQuery(
    FETCH_TRAVEL_PRODUCTS,
    {
      variables: { page: 1, searchQuery: "" },
      notifyOnNetworkStatusChange: true,
    }
  );

  // 최초 데이터 및 검색어 변경 시
  useEffect(() => {
    refetch({ page: 1, searchQuery }).then((res: any) => {
      const items = res.data.fetchTravelproducts || [];
      setProducts(items);
      setPage(1);
      setHasMore(items.length === PAGE_SIZE);
    });
    // eslint-disable-next-line
  }, [searchQuery]);

  // 무한 스크롤 Intersection Observer 개선
  useEffect(() => {
    if (!loader.current) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !isFetchingMore && hasMore) {
          setIsFetchingMore(true);
          fetchMore({
            variables: { page: page + 1, searchQuery },
          })
            .then((res: any) => {
              const newItems = res.data.fetchTravelproducts || [];
              setProducts((prev) => {
                const ids = new Set(prev.map((p) => p._id));
                const uniqueNewItems = newItems.filter(
                  (item: any) => !ids.has(item._id)
                );
                return [...prev, ...uniqueNewItems];
              });
              setPage((prev) => prev + 1);
              setHasMore(newItems.length === PAGE_SIZE);
              setIsFetchingMore(false);
            })
            .catch(() => {
              setIsFetchingMore(false);
            });
        }
      },
      { threshold: 1 }
    );
    observer.current.observe(loader.current);
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loader, hasMore, loading, isFetchingMore, page, searchQuery, fetchMore]);

  // 가격 원화 포맷
  const formatPrice = (price: number) =>
    price ? price.toLocaleString("ko-KR") + "원" : "-";

  // 검색 입력 핸들러
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center w-full max-w-lg bg-[#E8EDF2] rounded-2xl px-4 py-1 gap-2 shadow-sm">
          <Search className="text-blue-400 mr-2 w-5 h-5" stroke="#7B93B1" />
          <Input
            className="bg-transparent border-none shadow-none focus:ring-0 text-base placeholder:text-[#7B93B1]"
            placeholder="Search for Community Board"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Write Button */}
        <Link href="products/write">
          <Button className="ml-4 h-[42px] px-4 flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            글쓰기
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
        {products.map((product, index) => (
          <div
            key={`${product._id}-${index}`}
            className="flex flex-col items-center"
          >
            <Card className="w-full h-52 overflow-hidden relative transition-transform duration-300 ease-in-out hover:scale-105 bg-gray-100">
              <Image
                src={
                  product.images?.[0]
                    ? `https://storage.googleapis.com/${product.images[0]}`
                    : "/images/defaultImage.png"
                }
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 20vw"
                priority={false}
              />
            </Card>
            <div className="mt-2 text-center w-full">
              <div className="font-medium truncate" title={product.name}>
                {product.name}
              </div>
              <div className="text-sm text-gray-500">
                {formatPrice(product.price)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div ref={loader} className="h-8" />
      {(loading || isFetchingMore) && (
        <div className="text-center py-4 text-gray-400">로딩 중...</div>
      )}
      {!hasMore && !loading && products.length > 0 && (
        <div className="text-center py-4 text-gray-400">
          모든 상품을 불러왔습니다.
        </div>
      )}
      {!loading && products.length === 0 && (
        <div className="text-center py-8 text-gray-400">상품이 없습니다.</div>
      )}
    </div>
  );
}
