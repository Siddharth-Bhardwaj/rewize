"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import ProfilePicture from "./ProfilePicture";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="bg-background sticky top-0 z-50 flex h-20 w-full items-center justify-between px-5 py-6 md:px-8">
      <Link href="/">
        <span className="text-accent-yellow text-2xl font-medium tracking-wider md:text-3xl">
          Rewize.
        </span>
      </Link>

      <div className="flex items-center gap-x-6">
        <Link href="/about-us">
          <span className="font-medium tracking-wide md:text-lg">About Us</span>
        </Link>

        {session && <ProfilePicture user={session?.user} />}
      </div>
    </div>
  );
};

export default Navbar;
