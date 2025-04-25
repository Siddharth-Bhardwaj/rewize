"use client";

import React, { type PropsWithChildren } from "react";

import Loader from "../Loader";

const PrimaryButton: React.FC<
  PropsWithChildren & {
    loading?: boolean;
    disabled?: boolean;
    handleClick?: () => void;
  }
> = ({ loading, disabled, children, handleClick }) => {
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className="disabled:bg-muted cursor-pointer rounded-md border border-black bg-white px-4 py-2 text-sm text-black transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] disabled:pointer-events-none"
    >
      {loading ? <Loader className="justify-self-center" /> : children}
    </button>
  );
};

export default PrimaryButton;
