import React from "react"
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import Link from 'next/link'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <main className="p-4 space-y-4">
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

        <div className="bg-gray-100 rounded-lg p-6 shadow max-w-md mx-auto h-64 flex flex-col">
          <p className="text-lg font-bold text-gray-800 text-center mb-4">GPS情報取得</p>
          <div className="flex-grow flex flex-col justify-center space-y-4">
            <Link href="/map">
                <Button variant="outline" className="w-full justify-center bg-white text-center px-4 py-3 text-gray-800 font-normal hover:bg-gray-200">
                承認する
                </Button>
            </Link>
            <Link href="/home">
                <Button variant="outline" className="w-full justify-center bg-white text-center px-4 py-3 text-gray-800 font-normal hover:bg-gray-200">
                承認しない
                </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-center space-x-4 max-w-md mx-auto">
          <Link href="/home">
            <Button className="rounded-full w-16 h-16 bg-[#FF6E7F] hover:bg-[#FF5C6F] text-white p-0 text-xs flex items-center justify-center">
              ホーム
            </Button>
          </Link>
          <Link href="/map">
            <Button 
                className="rounded-full w-16 h-16 bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 p-0 text-xs flex flex-col items-center justify-center"
            >
                <span>登城</span>
                <span>マップ</span>
            </Button>
          </Link>
          <Link href="/places">
            <Button 
                className="rounded-full w-16 h-16 bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 p-0 text-xs flex flex-col items-center justify-center"
            >
                <span>周辺</span>
                <span>情報</span>
            </Button>
          </Link>
          <Link href="/traffic">
            <Button 
                className="rounded-full w-16 h-16 bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 p-0 text-xs flex flex-col items-center justify-center"
            >
                <span>交通</span>
                <span>情報</span>
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home;
