import React from "react";

import PageContainer from "@/components/PageContainer";
import HowToUseWizard from "@/components/HowToUseWizard";
import HoverEffect from "@/components/ui/card-hover-effect";

import { merchants } from "@/lib/metadata";

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
