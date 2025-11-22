"use client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Heart, HeartCrack, Pencil } from "lucide-react";
import { useQuery } from "@apollo/client";
import { FETCH_BOARDS } from "@/graphql/queries/(boards)/fetchBoards";
import { FETCH_BOARDS_COUNT } from "@/graphql/queries/(boards)/fetchBoardsCount";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

export default function CommunityBoardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: boardsData, loading: boardsLoading } = useQuery(FETCH_BOARDS, {
    variables: {
      page: currentPage,
      search: searchQuery || undefined,
    },
  });

  const { data: countData, loading: countLoading } = useQuery(
    FETCH_BOARDS_COUNT,
    {
      variables: {
        search: searchQuery || undefined,
      },
    }
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 전체 페이지 수 계산
  const totalItems = countData?.fetchBoardsCount || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // 페이지 번호 생성 (최대 5개까지 표시)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Community Board</h1>
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
        <Link href="communityBoard/write">
          <Button className="ml-4 h-[42px] px-4 flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            글쓰기
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        {boardsLoading ? (
          <div>Loading...</div>
        ) : (
          boardsData?.fetchBoards.map((board: any) => (
            <Card
              key={board._id}
              className="p-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {board.title?.trim() ? board.title : "제목없음"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                    <span>{board.user?.name ?? board.writer}</span>
                    <span>・</span>
                    <span>
                      {formatDistanceToNow(new Date(board.createdAt), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{board.likeCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HeartCrack className="w-4 h-4 text-gray-400" />
                    <span>{board.dislikeCount || 0}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {!boardsLoading && !countLoading && totalPages > 0 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {getPageNumbers().map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
