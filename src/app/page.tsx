import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <div>
      <div>Home</div>
      <Link href="/map" passHref>
        <Button>Map Page</Button>
      </Link>
    </div>
  );
};

export default Home;
