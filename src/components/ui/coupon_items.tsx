import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

// Types
interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponUrl: string;
}

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

interface StadiumCouponItemProps {
  coupon: Coupon;
}

interface PlaceCouponItemProps {
  place: Place;
}

const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  couponUrl,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-2">
        <DialogClose className="absolute right-0 top-0 p-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
          <X className="h-4 w-4 text-black" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogTitle className="text-center mb-2">クーポン詳細</DialogTitle>
        <div className="flex flex-col items-center space-y-2">
          <Image
            src={couponUrl}
            alt="Coupon"
            width={300}
            height={300}
            className="rounded object-contain"
            priority
          />
          <Image
            src="/images/my_J_league_id.png"
            alt="My J League ID"
            width={200}
            height={200}
            className="rounded object-contain"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const StadiumCouponItem: React.FC<StadiumCouponItemProps> = ({ coupon }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-gray-800 font-medium">{coupon.name}</span>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-500 text-sm hover:text-blue-600 bg-blue-50 px-3 py-1 rounded-md transition-colors whitespace-nowrap"
            >
              クーポンを表示
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-shrink-0 ml-2 md:ml-4"
        >
          <Image
            src={coupon.imageUrl}
            alt={coupon.name}
            width={80}
            height={80}
            className="rounded object-contain h-20 md:h-20 h-16"
            style={{ width: "auto" }}
          />
        </button>
      </div>
      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        couponUrl={coupon.couponUrl}
      />
    </div>
  );
};

const PlaceCouponItem: React.FC<PlaceCouponItemProps> = ({ place }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-500 text-sm hover:text-blue-600 bg-blue-50 px-2 md:px-3 py-1 rounded-md transition-colors whitespace-nowrap"
            >
              クーポンを表示
            </button>
            <Link
              href={place.url}
              className="text-blue-500 text-sm hover:text-blue-600 whitespace-nowrap"
            >
              お店の詳細
            </Link>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-shrink-0 ml-2 md:ml-4"
        >
          <Image
            src={place.image_url}
            alt={place.placename}
            width={80}
            height={80}
            className="rounded object-contain h-20 md:h-20 h-16"
            style={{ width: "auto" }}
          />
        </button>
      </div>
      <CouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        couponUrl={place.coupon_url}
      />
    </div>
  );
};

export { StadiumCouponItem, PlaceCouponItem, type Coupon, type Place };
