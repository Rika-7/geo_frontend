import React from "react";
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

// Create separate data structures for each coupon category
const stadiumCoupons: Coupon[] = [
  {
    id: 1,
    name: "ビール半額！",
    imageUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/beer_stadium_1.png",
    couponUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/beer_stadium_1.png",
  },
  {
    id: 2,
    name: "ソフトドリンク無料！",
    imageUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/soft_drink_stadium_1.png",
    couponUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/soft_drink_stadium_1.png",
  },
];

const restaurantCoupons: Coupon[] = [
  {
    id: 1,
    name: "ビール",
    imageUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/beer_restaurant_1.png",
    couponUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/beer_restaurant_1.png",
  },
  {
    id: 2,
    name: "洋食レストラン",
    imageUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/course_western_1.png",
    couponUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/course_western_1.png",
  },
  {
    id: 3,
    name: "日本食レストラン",
    imageUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/course_japanese_1.png",
    couponUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/course_japanese_1.png",
  },
  {
    id: 4,
    name: "5%オフになるレストラン",
    imageUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/5_percent_off_1.png",
    couponUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/5_percent_off_1.png",
  },
  {
    id: 5,
    name: "ラーメン店",
    imageUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/ramen_1.png",
    couponUrl:
      "https://tech0gen7tokino.blob.core.windows.net/coupon/ramen_1.png",
  },
];

// Create a reusable CouponItem component
const CouponItem: React.FC<{ coupon: Coupon }> = ({ coupon }) => (
  <Link href={coupon.couponUrl} className="block">
    <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 transition-colors">
      <Image
        src={coupon.imageUrl}
        alt={coupon.name}
        width={50}
        height={50}
        className="rounded"
      />
      <span className="text-gray-800">{coupon.name}</span>
    </div>
  </Link>
);

const Coupon = () => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl text-center mt-4 mb-6">クーポン</h1>

      <div className="space-y-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>スタジアムクーポン</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            {stadiumCoupons.map((coupon) => (
              <CouponItem key={coupon.id} coupon={coupon} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>グルメクーポン</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            {restaurantCoupons.map((coupon) => (
              <CouponItem key={coupon.id} coupon={coupon} />
            ))}
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
            <>
              <span>クー</span>
              <span>ポン</span>
            </>
          }
          isActive={true}
        />
      </div>
    </div>
  );
};

export default Coupon;
