"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isGpson, setIsGpson] = useState(false);

  useEffect(() => {
    setIsGpson(true);
  }, []);

  return (
    <div>
      <h1>
        {isGpson ? "このアプリはGPS位置情報を使用します" : "Pre-rendered"}
      </h1>
      <Button className="flex flex-col" variant="outline">
        OK
      </Button>
    </div>
  );
}
