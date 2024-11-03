import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4">Home</div>
      <Link href="/map" passHref>
        <Button className={buttonVariants({ variant: "secondary" })}>
          Map Page
        </Button>
      </Link>
    </div>
  );
};

export default Home;
