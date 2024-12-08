import React from "react";
import { MenuButton } from "@/components/ui/menu_button";

const Traffic = () => {
  return (
    <div>
      <div>
        <h1 className="text-2xl text-center mt-4">交通情報</h1>
        <div className="text-center mt-2">
          <p>交通情報はまだありません</p>
        </div>
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
          isActive={true}
        />
      </div>
    </div>
  );
};

export default Traffic;
