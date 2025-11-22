"use client";

import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apolloClient";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function ApolloWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
  }, [setAccessToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
