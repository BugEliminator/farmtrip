"use client";
// any 타입 추후 수정 예정
import { Card } from "@/components/ui/card";
import { FETCH_BOARDS } from "@/graphql/queries/(boards)/fetchBoards";
import { FETCH_TRAVEL_PRODUCTS } from "@/graphql/queries/(product)/fetchTravelproducts";
import { useQuery } from "@apollo/client";
import Image from "next/image";

const experiencesName = [
  { name: "Farm Tour" },
  { name: "Cheese Making" },
  { name: "Beef Tasting" },
  { name: "Salmon Fishing" },
  { name: "Chocolate Workshop" },
];

export default function Home() {
  const { data } = useQuery(FETCH_TRAVEL_PRODUCTS, {
    variables: { page: 1 },
  });

  const products = data?.fetchTravelproducts?.slice(0, 5); // 최신상품 5개만
  console.log(products);

  const { data: boardData } = useQuery(FETCH_BOARDS, {
    variables: {
      endDate: null,
      startDate: null,
      search: "",
      page: 1,
    },
  });

  const boards = boardData?.fetchBoards?.slice(0, 5);
  console.log(`자유커뮤니티 ${boards}`);

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-16">
      <div
        className="h-[400px] rounded-2xl flex flex-col items-center justify-center text-center mb-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mainBanner.jpeg')" }}
      >
        <h1 className="text-6xl font-bold text-white drop-shadow-md mb-6">
          Farm to Table Delivered
        </h1>
        <p className="text-lg text-white drop-shadow-sm">
          Discover fresh produce, pantry staples, and more, direct from the farm
        </p>
      </div>

      {/* Featured Products */}
      <section className="mt-20">
        <h2 className="text-3xl font-semibold mb-12">Featured Products</h2>
        <div className="grid grid-cols-5 gap-6">
          {products?.map((product: any) => (
            <div key={product._id} className="flex flex-col items-start">
              <Card className="w-full h-52 overflow-hidden relative transition-transform duration-300 ease-in-out hover:scale-105 bg-gray-100 ">
                <Image
                  src={
                    product.images?.[0]
                      ? `https://storage.googleapis.com/${product.images[0]}`
                      : "/images/defaultImage.png"
                  }
                  alt={product.title ?? "상품 이미지"}
                  fill
                  className="object-cover"
                />
              </Card>
              <span className="mt-3 text-base font-medium">{product.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="mt-24">
        <h2 className="text-3xl font-semibold mb-12">Featured Experiences</h2>
        <div className="grid grid-cols-5 gap-6">
          {experiencesName.map((item) => (
            <div key={item.name} className="flex flex-col">
              <Card className="w-full h-48 overflow-hidden flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-105 bg-gray-100" />
              <span className="mt-2 text-base font-medium text-left">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Community Board */}
      <section className="mt-24">
        <h2 className="text-3xl font-semibold mb-12">Community Board</h2>
        <div className="grid grid-cols-5 gap-6">
          {boards?.map((board: any) => (
            <div key={board._id} className="flex flex-col items-start">
              <Card className="w-full h-48 overflow-hidden relative transition-transform duration-300 ease-in-out hover:scale-105 bg-gray-100">
                <Image
                  src={
                    board.images?.[0]
                      ? `https://storage.googleapis.com/${board.images[0]}`
                      : "/images/defaultImage.png"
                  }
                  alt={board.title}
                  fill
                  className="object-cover"
                />
              </Card>
              <span className="mt-3 text-base font-medium line-clamp-2">
                {board.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className=" bg-gray-100 text-sm text-gray-500 py-6 mt-24">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <p>© 2025 FarmTrip. All rights reserved.</p>
          <p>
            Built with
            <span className="font-medium"> Next.js, Apollo</span> by 찬우
          </p>
        </div>
      </footer>
    </div>
  );
}
