import React from "react";

import Container from "@/components/Container";
import PageContainer from "@/components/PageContainer";

const AuthLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <PageContainer className="items-center justify-center">
      <Container className="flex h-fit! w-full max-w-lg flex-col gap-y-8 p-4 md:w-1/3 md:min-w-lg md:p-8">
        <h2 className="text-xl font-bold tracking-wide text-neutral-800 md:text-2xl dark:text-neutral-200">
          Welcome to Rewize
        </h2>
        {children}
      </Container>
    </PageContainer>
  );
};

export default AuthLayout;
