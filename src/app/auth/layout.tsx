import React from "react";
import PageContainer from "@/components/PageContainer";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

const AuthLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

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
