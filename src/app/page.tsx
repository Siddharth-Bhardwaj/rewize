"use client";

import Link from "next/link";

import Button from "@/components/ui/button";
import PageContainer from "@/components/PageContainer";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

export default function HomePage() {
  return (
    <PageContainer hero>
      <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:items-end">
        <span>Maximize your </span>
        <ContainerTextFlip words={["time", "profits", "savings"]} />
      </div>

      <Link href="/dashboard">
        <Button>Get Started</Button>
      </Link>
    </PageContainer>
  );
}
