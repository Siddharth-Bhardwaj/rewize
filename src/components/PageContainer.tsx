"use client";

import React, { type PropsWithChildren } from "react";
import { motion } from "motion/react";

import Navbar from "./Navbar";
import { ShootingStars } from "./ui/shooting-stars";
import { StarsBackground } from "./ui/stars-background";

const PageContainer: React.FC<
  PropsWithChildren & { hero?: boolean; className?: string }
> = ({ hero, children, className = "" }) => {
  const mainClassName = hero
    ? `mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center 
  text-2xl font-medium tracking-tight text-transparent 
  bg-gradient-to-b from-neutral-800 via-white to-white bg-clip-text 
  sm:text-3xl md:text-5xl md:leading-tight ${className}`
    : `flex-1 flex flex-col w-full px-6 pt-6 pb-10 overflow-auto max-h-[calc(100vh-5rem)] md:px-8 ${className}`;

  return (
    <main className="bg-background text-primary flex h-screen w-full flex-col">
      <div className="relative z-10 flex h-screen w-full flex-col">
        <Navbar />

        <motion.div
          className={mainClassName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>

      <ShootingStars />
      <StarsBackground />
    </main>
  );
};

export default PageContainer;
