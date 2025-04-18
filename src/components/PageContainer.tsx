import React, { type PropsWithChildren } from "react";

import { ShootingStars } from "./ui/shooting-stars";
import { StarsBackground } from "./ui/stars-background";
import Navbar from "./Navbar";

const PageContainer: React.FC<
  PropsWithChildren & { hero?: boolean; className?: string }
> = ({ hero, children, className = "" }) => {
  const mainClassName = hero
    ? `mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center gap-2 bg-gradient-to-b from-neutral-800 via-white to-white bg-clip-text text-center text-3xl font-medium tracking-tight text-transparent md:gap-8 md:text-5xl md:leading-tight ${className}`
    : `flex-1 flex flex-col px-5 md:px-8 py-4 w-full ${className}`;

  return (
    <main className="bg-background text-primary flex min-h-screen w-full flex-col items-center justify-center">
      <div className="relative z-10 flex h-screen w-full flex-col">
        <Navbar />

        <div className={mainClassName}>{children}</div>
      </div>

      <ShootingStars />
      <StarsBackground />
    </main>
  );
};

export default PageContainer;
