import type React from "react";

const ProtectedPathLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="bg-white">{children}</div>;
};

export default ProtectedPathLayout;
