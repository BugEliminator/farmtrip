// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@apollo/client";
import { useAuthStore } from "@/store/useAuthStore";
import { LOGOUT_USER } from "@/graphql/mutations/logout";
import { FETCH_USER_LOGGED_IN } from "@/graphql/queries/fetchUserLoggedIn";

export default function Header() {
  const [logoutUser] = useMutation(LOGOUT_USER);
  // const { data, loading } = useQuery(FETCH_USER_LOGGED_IN);  추후 사용 예정
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const router = useRouter();

  const pathname = usePathname();
  // 헤더 안보여줄 페이지들
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (isAuthPage) return null;

  const handleLogout = async () => {
    try {
      await logoutUser(); // 서버에도 로그아웃 요청 (optional)

      clearAccessToken(); // Zustand 비우기
      localStorage.removeItem("accessToken"); // localStorage 비우기

      router.push("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <header className="flex items-center justify-between px-12 w-full h-20 shadow-sm">
      {/* 왼쪽: 로고 + 메뉴 */}
      <div className="flex items-center gap-12">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/farm_trip_logo2.png"
            alt="FarmTrip Logo"
            width={100}
            height={0}
            className="w-10 h-10 object-contain"
          />
          <div className="text-2xl font-bold">FarmTrip</div>
        </Link>
        {/* 메뉴 */}
        <nav className="flex gap-8 text-lg font-medium">
          <Link href="/products">Products</Link>
          <Link href="/experiences">Experiences</Link>
          <Link href="/communityBoard">Community Board</Link>
          <Link href="/myPage">My Page</Link>
        </nav>
      </div>

      {/* 오른쪽: 아이콘 */}
      <div className="flex items-center gap-4">
        <Button onClick={handleLogout}>로그아웃</Button>
        <div className="flex justify-center items-center w-10 h-10 bg-gray-300 rounded-lg">
          <Heart className="w-4 h-4" />
        </div>
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
      </div>
    </header>
  );
}
