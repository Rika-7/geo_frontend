// import React from "react";
// import { Button, buttonVariants } from "@/components/ui/button";
// import Link from "next/link";

// const Home: React.FC = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <div className="mb-4">Home</div>
//       <Link href="/map" passHref>
//         <Button className={buttonVariants({ variant: "secondary" })}>
//           Map Page
//         </Button>
//       </Link>
//     </div>
//   );
// };

import React from "react"
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <main className="p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold">町田GIONスタジアムへ！</h1>
          <h2 className="text-lg mt-2">いざ登城！</h2>
        </div>

        {/* Illustration placeholder */}
        <div className="relative w-full max-w-md h-48 mx-auto">
          <Image
            src="/images/castle.png"
            alt="castle"
            fill
            className="rounded-lg"
            priority
          />
        </div>

        <div className="bg-gray-100 rounded-lg p-4 shadow">
          <p className="text-lg font-bold text-gray-800 text-center mb-4">試合情報</p>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between bg-white text-left px-4 py-3 text-gray-800 font-normal hover:bg-gray-200">
              節・日時・対戦チーム
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </Button>
            <Button variant="outline" className="w-full justify-end bg-white py-3 hover:bg-gray-200">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </Button>
            <Button variant="outline" className="w-full justify-end bg-white py-3 hover:bg-gray-200">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <Button className="w-full bg-[#FF6E7F] hover:bg-[#FF5C6F] text-white">ログイン</Button>
          <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white hover:text-black">新規登録</Button>
        </div>
      </main>
    </div>
  )
}

export default Home;
