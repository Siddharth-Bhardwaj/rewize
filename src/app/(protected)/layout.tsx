import type React from "react";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

const ProtectedPathLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return children;
};

export default ProtectedPathLayout;
