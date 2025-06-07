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
import { CREATE_USER } from "@/graphql/mutations/signup";
import { useRouter } from "next/navigation";

export default function SignupForm({ className }: React.ComponentProps<"div">) {
  const [createUser] = useMutation(CREATE_USER);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await createUser({
        variables: {
          createUserInput: {
            email,
            password,
            name,
          },
        },
      });
      alert("회원가입이 완료되었습니다.");
      router.push("/login"); // 가입 후 로그인 페이지로 이동
    } catch (error) {
      console.error(error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center h-screen",
        className
      )}
    >
      <div className="absolute inset-0 bg-[url('/images/authBg.jpeg')] bg-cover bg-center opacity-70" />
      <div className="relative z-10">
        <Card className={cn("flex flex-col gap-8 w-[400px] p-8")}>
          <CardHeader>
            <CardTitle>회원가입</CardTitle>
            <CardDescription>
              아래 정보를 입력해 회원가입을 진행하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" type="text" placeholder="홍길동" required />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    회원가입
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                이미 계정이 있으신가요?
                <Link
                  className="underline underline-offset-4 ml-1"
                  href="/login"
                >
                  로그인
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
