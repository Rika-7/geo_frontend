"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Favorites() {
  const [selectedTab, setSelectedTab] = useState<"jleague" | "favorites">(
    "jleague"
  );

  const jleagueMenuItems = [
    "クラブ・選手",
    "成績・データ",
    "特集",
    "プロモーションコード入力",
    "明治安田コード入力",
    "リモートチェックイン",
    "ワンタッチパス連携",
    "外部アカウント連携",
    "先行入場申し込み",
    "クーポン一覧",
    "1日1回チャレンジ！",
    "ペアチケットチャンス",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center p-4 border-b">
        <Link href="#" className="text-blue-600">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="flex-1 text-center text-lg text-gray-600 font-medium">
          メニュー
        </h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 px-4 text-center ${
            selectedTab === "jleague"
              ? "text-gray-800 border-b-2 border-gray-800"
              : "text-gray-400"
          }`}
          onClick={() => setSelectedTab("jleague")}
        >
          Jリーグ
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center ${
            selectedTab === "favorites"
              ? "text-gray-800 border-b-2 border-gray-800"
              : "text-gray-400"
          }`}
          onClick={() => setSelectedTab("favorites")}
        >
          お気に入りクラブ
        </button>
      </div>

      <div className="p-4">
        {selectedTab === "jleague" && (
          <nav className="space-y-4">
            {jleagueMenuItems.map((item, index) => (
              <Link
                key={index}
                href="#"
                className="flex items-center justify-between py-3 border-b border-gray-50 text-gray-700"
              >
                <span>{item}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            ))}
          </nav>
        )}

        {selectedTab === "favorites" && (
          <section>
            <div className="space-y-6">
              <div className="flex items-center border-b border-gray-50 pb-3">
                <Image
                  src="/images/logo_zelvia.png"
                  alt="zelvia"
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                />
                <span className="text-lg text-gray-900">FC町田ゼルビア</span>
              </div>
              <nav className="space-y-4 border-b border-gray-50">
                <Link
                  href="https://www.zelvia.co.jp/"
                  className="block text-gray-600 border-b border-gray-50 pb-3"
                >
                  オフィシャルサイト
                </Link>
                <Link
                  href="https://www.jleague-ticket.jp/club/mz/?utm_source=JApp&utm_medium=Menu"
                  className="block text-gray-600 border-b border-gray-50 pb-3"
                >
                  チケットサイト
                </Link>
                <Link
                  href="https://tech0-gen-7-step4-student-finalproject-3-g6fnhbbhhegnccc0.canadacentral-01.azurewebsites.net/home"
                  className="block text-gray-600 border-b border-gray-50 pb-3"
                >
                  ゼルビアロード
                </Link>
              </nav>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
