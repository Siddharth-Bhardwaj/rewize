"use client";

import type React from "react";
import { ProgressProvider } from "@bprogress/next/app";

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="2px"
      color="#f8ff3d"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default ProgressBarProvider;
