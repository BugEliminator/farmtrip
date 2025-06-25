"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/graphql/mutations/(authentication)/login";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function LoginForm({ className }: React.ComponentProps<"div">) {
  const [loginUser] = useMutation(LOGIN_USER);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log(email);
    console.log(password);
    try {
      const response = await loginUser({
        variables: {
          email,
          password,
        },
      });
      const token = response.data.loginUser.accessToken;
      setAccessToken(token);
      localStorage.setItem("accessToken", token);

      router.push("/"); // 로그인 성공 시 이동
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("로그인 실패했습니다!");
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 items-center justify-center h-screen",
        className
      )}
    >
      <div className="absolute inset-0 bg-[url('/images/authBg.jpeg')] bg-cover bg-center opacity-70" />
      <div className="relative z-10">
        <Card className={cn("flex flex-col gap-8 w-[400px] p-8")}>
          <CardHeader>
            <CardTitle>귀하의 계정에 로그인하세요</CardTitle>
            <CardDescription>
              계정에 로그인하려면 아래에 이메일을 입력하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">비밀번호</Label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    로그인
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                계정이 없으신가요?
                <Link
                  className="underline underline-offset-4 ml-1"
                  href="/signup"
                >
                  가입하세요
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
