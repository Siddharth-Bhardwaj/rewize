"use client";

import { cn } from "@/lib/utils";

const LoadingCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative isolate aspect-[210/331.7] w-[210px] overflow-hidden rounded-lg border border-slate-800 bg-neutral-900",
        className
      )}
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-800 opacity-70" />

      <div className="relative z-10 flex h-full w-full items-end justify-between px-8 py-6">
        <div className="h-full w-12 rounded-lg bg-neutral-700" />
        <div className="h-3/12 w-8 rounded-lg bg-neutral-700" />
      </div>

      <div className="absolute inset-0 z-20 rounded-lg bg-black/20 backdrop-blur-sm" />
    </div>
  );
};

export default LoadingCard;
