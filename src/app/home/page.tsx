import React from "react";
import { Button } from "@/components/ui/button";
import { MenuButton } from "@/components/ui/menu_button";
import Image from "next/image";
import Link from "next/link";

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
          <p className="text-lg font-bold text-gray-800 text-center mb-4">
            GPS情報取得
          </p>
          <div className="flex-grow flex flex-col justify-center space-y-4">
            <Link href="/map">
              <Button
                variant="outline"
                className="w-full justify-center bg-white text-center px-4 py-3 text-gray-800 font-normal hover:bg-gray-200"
              >
                承認する
              </Button>
            </Link>
            <Link href="/home">
              <Button
                variant="outline"
                className="w-full justify-center bg-white text-center px-4 py-3 text-gray-800 font-normal hover:bg-gray-200"
              >
                承認しない
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-center space-x-4 max-w-md mx-auto">
          <MenuButton href="/home" label="ホーム" isActive={true} />
          <MenuButton
            href="/map"
            label={
              <>
                <span>登城</span>
                <span>マップ</span>
              </>
            }
          />
          <MenuButton
            href="/places"
            label={
              <>
                <span>周辺</span>
                <span>情報</span>
              </>
            }
          />
          <MenuButton
            href="/traffic"
            label={
              <>
                <span>交通</span>
                <span>情報</span>
              </>
            }
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
