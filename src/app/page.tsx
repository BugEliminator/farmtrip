"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client";

import { FETCH_USER_LOGGED_IN } from "@/graphql/queries/fetchUserLoggedIn";

export default function Home() {
  const { data, loading } = useQuery(FETCH_USER_LOGGED_IN);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <div>Hi, {data?.fetchUserLoggedIn.name} 👋</div>
      <Link href="/login">Login</Link>
      <br />
      <Link href="/signup">Signup</Link>
    </div>
  );
}
