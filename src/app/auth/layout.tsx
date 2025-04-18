import React from "react";
import PageContainer from "@/components/PageContainer";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <PageContainer className="items-center">
      <div className="border-border flex w-1/3 flex-col gap-y-8 rounded-xl border-2 p-8">
        <h2 className="text-xl font-bold tracking-wide text-neutral-800 md:text-2xl dark:text-neutral-200">
          Welcome to Rewize
        </h2>
        {children}
      </div>
    </PageContainer>
  );
};

export default AuthLayout;
