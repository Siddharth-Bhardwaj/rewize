import React, { type PropsWithChildren } from "react";

import Loader from "../Loader";

const Button: React.FC<
  PropsWithChildren & {
    loading?: boolean;
    disabled?: boolean;
    hideIcon?: boolean;
    handleClick?: () => void;
  }
> = ({ disabled, loading, children, hideIcon, handleClick }) => {
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className="group bg-surface text-primary relative inline-block cursor-pointer rounded-full p-px text-sm leading-6 font-medium no-underline shadow-2xl shadow-black disabled:cursor-pointer disabled:opacity-70"
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,#f8ff3d_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <div className="bg-background relative z-10 flex items-center space-x-2 overflow-hidden rounded-full px-4 py-1 ring-1 ring-white/[9%]">
        {loading && (
          <div className="bg-background absolute inset-0 z-10 flex h-full w-full items-center justify-center">
            <Loader className="h-4 w-4" />
          </div>
        )}

        <span className="tracking-wide">{children}</span>

        {!hideIcon && (
          <svg
            fill="none"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.75 8.75L14.25 12L10.75 15.25"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        )}
      </div>
      <span className="via-accent-yellow absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-[rgba(0,255,136,0)] to-[rgba(0,255,136,0)] transition-opacity duration-500 group-hover:opacity-40" />
    </button>
  );
};

export default Button;
