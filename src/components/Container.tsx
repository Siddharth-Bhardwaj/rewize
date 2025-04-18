"use client";

import React, { type PropsWithChildren } from "react";

import { GlowingEffect } from "./ui/glowing-effect";

const Container: React.FC<PropsWithChildren & { className?: string }> = ({
  children,
  className = "",
}) => {
  const divClassName = `relative h-full rounded-xl border p-2 md:rounded-2xl md:p-3 ${className}`;

  return (
    <div className={divClassName}>
      <GlowingEffect
        blur={0}
        borderWidth={3}
        spread={80}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />

      {children}
    </div>
  );
};

export default Container;
