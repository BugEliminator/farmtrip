"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT_USER } from "@/graphql/mutations/logout"; // <- 우리가 방금 만든거
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { FETCH_USER_LOGGED_IN } from "@/graphql/queries/fetchUserLoggedIn";

export default function Home() {
  const [logoutUser] = useMutation(LOGOUT_USER);
  const { data, loading } = useQuery(FETCH_USER_LOGGED_IN);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser(); // 서버에도 로그아웃 요청 (optional)

      clearAccessToken(); // Zustand 비우기
      localStorage.removeItem("accessToken"); // localStorage 비우기

      router.push("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
      // TODO: 에러 처리 필요시
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>메인페이지로 활용될 부분</h1>
      <div>Hi, {data?.fetchUserLoggedIn.name} 👋</div>
      <Link href="/login">Login</Link>
      <br />
      <Link href="/signup">Signup</Link>
      <br />
      <Button onClick={handleLogout}>로그아웃</Button> {/* <- onClick 연결 */}
    </div>
  );
}
