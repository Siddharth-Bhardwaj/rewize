import React from "react";

import PageContainer from "@/components/PageContainer";
import HowToUseWizard from "@/components/HowToUseWizard";
import HoverEffect from "@/components/ui/card-hover-effect";

export const merchants = [
  {
    title: "Amazon",
    description: "A multinational technology company focusing on e-commerce",
    link: "/merchant/amazon",
  },
  {
    title: "ByteBites",
    description:
      "Order takeout or dine in with ease — flavor meets convenience.",
    link: "/merchant/byte-bites",
  },
  {
    title: "FreshMart",
    description:
      "Your go-to destination for fresh groceries and daily essentials.",
    link: "/merchant/fresh-mart",
  },
  {
    title: "JetPath",
    description: "Seamless travel bookings for wherever you're headed next.",
    link: "/merchant/jetpath",
  },
];

const HowToUse = () => {
  return (
    <PageContainer>
      <div className="flex flex-col items-center px-4 text-center">
        <h1 className="mb-6 text-4xl font-bold text-white">How to Use</h1>

        <HowToUseWizard />

        {/* Magic Message */}
        <p className="text-16px mt-4 text-white italic">
          let our tool do its magic ✨
        </p>

        <div className="mx-auto max-w-5xl px-8">
          <HoverEffect items={merchants} />
        </div>
      </div>
    </PageContainer>
  );
};

export default HowToUse;
