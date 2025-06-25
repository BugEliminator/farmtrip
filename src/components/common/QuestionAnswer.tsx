// 나중에 자유, 상품, 체험 모두 q&a 들어갈 예정

import Image from "next/image";
import { Button } from "../ui/button";

export default function QuestionAnswer() {
  const mockQnA: any[] = [];
  return (
    <div>
      <div className="mb-8">
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
              {q.answers.map((a: any) => (
                // any 수정하기
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
      </div>
    </div>
  );
}
