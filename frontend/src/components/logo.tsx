import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
        blockpolls
      </h1>
    </Link>
  );
};

export default Logo;
