import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-between px-5 py-6 md:px-8">
      <Link href="/">
        <span className="text-2xl font-medium tracking-wide">Rewize.</span>
      </Link>
      <Link href="/about-us">
        <span className="">About Us</span>
      </Link>
    </div>
  );
};

export default Navbar;
