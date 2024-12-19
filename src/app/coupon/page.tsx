"use client";

import React, { useState, useEffect } from "react";
import { MenuButton } from "@/components/ui/menu_button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

// Define types for our coupon data
interface Coupon {
  id: number;
  name: string;
  imageUrl: string;
  couponUrl: string;
}

interface Place {
  place_id: number;
  placename: string;
  image_url: string;
  coupon_url: string;
  category: string;
  has_coupon: boolean;
  description: string;
  url: string;
}

const stadiumCoupons: Coupon[] = [
  {
    id: 1,
    name: "ビール2杯目半額！",
    imageUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/beer_stadium_1.png",
    couponUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/beer_stadium_1.png",
  },
  {
    id: 2,
    name: "フード購入でソフトドリンク無料！",
    imageUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/soft_drink_stadium_1.png",
    couponUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/soft_drink_stadium_1.png",
  },
];

const StadiumCouponItem: React.FC<{ coupon: Coupon }> = ({ coupon }) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-gray-800 font-medium">{coupon.name}</span>
        <div className="flex items-center gap-2 mt-1">
          <Link
            href={coupon.couponUrl}
            className="text-blue-500 text-sm hover:text-blue-600 bg-blue-50 px-3 py-1 rounded-md transition-colors whitespace-nowrap"
          >
            クーポンを表示
          </Link>
        </div>
      </div>
      <Link href={coupon.couponUrl} className="flex-shrink-0 ml-2 md:ml-4">
        <Image
          src={coupon.imageUrl}
          alt={coupon.name}
          width={80}
          height={80}
          className="rounded object-contain h-20 md:h-20 h-16"
          style={{ width: "auto" }}
        />
      </Link>
    </div>
  </div>
);

const PlaceCouponItem: React.FC<{ place: Place }> = ({ place }) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-start justify-between p-2 rounded hover:bg-gray-50 transition-colors">
      <div className="flex flex-col flex-1 min-w-0">
        <Link
          href={place.url}
          className="text-gray-800 font-medium hover:text-blue-600"
        >
          {place.placename}
        </Link>
        <span className="text-gray-500 text-sm">{place.description}</span>
        <div className="flex items-center gap-1 md:gap-2 mt-1">
          <Link
            href={place.coupon_url}
            className="text-blue-500 text-sm hover:text-blue-600 bg-blue-50 px-2 md:px-3 py-1 rounded-md transition-colors whitespace-nowrap"
          >
            クーポンを表示
          </Link>
          <Link
            href={place.url}
            className="text-blue-500 text-sm hover:text-blue-600 whitespace-nowrap"
          >
            お店の詳細
          </Link>
        </div>
      </div>
      <Link href={place.coupon_url} className="flex-shrink-0 ml-2 md:ml-4">
        <Image
          src={place.image_url}
          alt={place.placename}
          width={80}
          height={80}
          className="rounded object-contain h-20 md:h-20 h-16"
          style={{ width: "auto" }}
        />
      </Link>
    </div>
  </div>
);

const Coupon = () => {
  const [restaurantPlaces, setRestaurantPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantPlaces = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://tech0-gen-7-step4-student-finalproject-4-exeabgd9eyekb7c2.canadacentral-01.azurewebsites.net";
        const response = await fetch(`${apiUrl}/places`);

        if (!response.ok) {
          throw new Error("Failed to fetch places");
        }
        const data = await response.json();

        const restaurantWithCoupons = data.filter((place: Place) => {
          const isRestaurant =
            place.category === "グルメ" || place.category === "eatery";
          return isRestaurant && place.has_coupon === true;
        });

        console.log(
          "Filtered restaurants with coupons:",
          restaurantWithCoupons
        );
        setRestaurantPlaces(restaurantWithCoupons);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantPlaces();
  }, []);

  return (
    <div className="container mx-auto px-2 md:px-4">
      <h1 className="text-2xl text-center font-bold mt-4 mb-6">クーポン</h1>

      <div className="space-y-3 md:space-y-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">スタジアム</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2 p-2 md:p-6">
            {stadiumCoupons.map((coupon) => (
              <StadiumCouponItem key={coupon.id} coupon={coupon} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-bold">グルメ</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2 p-2 md:p-6">
            {isLoading ? (
              <div className="text-center p-4">読み込み中...</div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">{error}</div>
            ) : restaurantPlaces.length === 0 ? (
              <div className="text-center p-4">
                現在利用可能なクーポンはありません
              </div>
            ) : (
              restaurantPlaces.map((place) => (
                <PlaceCouponItem key={place.place_id} place={place} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-2 max-w-md mx-auto mt-4 pb-2">
        <MenuButton href="/home" label="ホーム" />
        <MenuButton
          href="/map"
          label={
            <>
              <span className="text-xs">登城</span>
              <span className="text-xs">マップ</span>
            </>
          }
        />
        <MenuButton
          href="/places"
          label={
            <>
              <span className="text-xs">周辺</span>
              <span className="text-xs">情報</span>
            </>
          }
        />
        <MenuButton
          href="/traffic"
          label={
            <>
              <span className="text-xs">交通</span>
              <span className="text-xs">情報</span>
            </>
          }
        />
        <MenuButton
          href="/coupon"
          label={
            <React.Fragment>
              <span>クー</span>
              <span>ポン</span>
            </React.Fragment>
          }
          isActive={true}
        />
      </div>
    </div>
  );
};

export default Coupon;
