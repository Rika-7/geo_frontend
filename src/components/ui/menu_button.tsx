import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MenuButtonProps {
  href: string;
  label: string | React.ReactNode;
  isActive?: boolean;
}

export function MenuButton({ href, label, isActive = false }: MenuButtonProps) {
  return (
    <Link href={href}>
      <Button
        className={`rounded-full w-16 h-16 p-0 text-xs flex flex-col items-center justify-center
          ${
            isActive
              ? "bg-[#FF6E7F] hover:bg-[#FF5C6F] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
          }`}
      >
        {typeof label === "string" ? label : label}
      </Button>
    </Link>
  );
}
