"use client";

import React, { type PropsWithChildren } from "react";

const PrimaryButton: React.FC<
  PropsWithChildren & { handleClick?: () => void }
> = ({ children, handleClick }) => {
  return (
    <button
      onClick={handleClick}
      className="cursor-pointer rounded-md border border-black bg-white px-4 py-2 text-sm text-black transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
