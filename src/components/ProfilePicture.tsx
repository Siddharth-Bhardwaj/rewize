"use client";

import React, { type PropsWithChildren } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiUser } from "react-icons/fi";

import type { User } from "next-auth";

interface ProfilePicProps {
  user: User | null | undefined;
}

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => (
  <Link href="/profile">
    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-[1.5px]">
      {children}
    </div>
  </Link>
);

const ProfilePicture: React.FC<ProfilePicProps> = ({ user }) => {
  if (!user?.image)
    return (
      <Wrapper>
        <FiUser size="1.25rem" />
      </Wrapper>
    );

  return (
    <Wrapper>
      <Image
        alt="profile pic"
        width={32}
        height={32}
        src={user.image}
        className="h-full w-full object-cover"
      />
    </Wrapper>
  );
};

export default ProfilePicture;
