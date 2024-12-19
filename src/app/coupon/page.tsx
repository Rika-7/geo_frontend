//

"use client";

import React, { useState, useEffect } from "react";
import { MenuButton } from "@/components/ui/menu_button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  StadiumCouponItem,
  PlaceCouponItem,
  type Coupon,
  type Place,
} from "@/components/ui/coupon_items";

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

const Coupon: React.FC = () => {
  const [restaurantPlaces, setRestaurantPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    <div className="container mx-auto px-2 md:px-2">
      <h1 className="text-2xl text-center font-bold mt-4 mb-6">クーポン</h1>

      <div className="space-y-3 md:space-y-3 mb-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">スタジアム</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2 p-2 md:p-4">
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
