"use client";

import Link from "next/link";

import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { GlareCard } from "@/components/ui/glare-card";
import Carousel from "@/components/carousel/Carousel";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import Button from "@/components/ui/button";
import PageContainer from "@/components/PageContainer";
import { Input } from "@/components/ui/input";
import Container from "@/components/Container";
import CardDetailsContainer from "@/components/CardDetailsContainer";
import { useEffect } from "react";
import axios from "axios";

export default function HomePage() {
  useEffect(() => {
    const fn = async () => {
      const res = await axios.post("/api/cards", {
        name: "Chase Sapphire Preferred",
        issuer: "Chase",
        networkType: "Visa",
        annualFee: "95",
        description:
          "Popular travel rewards card with bonus points on travel and dining",
        rewards: [
          {
            categoryName: "Travel",
            rewardRate: "5%",
          },
          {
            categoryName: "Dining",
            rewardRate: "3%",
          },
          {
            categoryName: "Streaming",
            rewardRate: "3%",
            isRotatingReward: false,
          },
          {
            categoryName: "Gas",
            rewardRate: "2%",
            isRotatingReward: true,
            quarterActive: 2,
          },
        ],
      });

      console.log(res);
    };

    fn();
  }, []);

  return (
    <PageContainer hero>
      <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:items-end">
        <span>Maximize your </span>
        <ContainerTextFlip words={["time", "profits", "savings"]} />
      </div>

      <Button>Get Started</Button>

      {/* <div className="flex gap-x-8">
        <CardDetailsContainer />
      </div> */}
    </PageContainer>

    // <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"></main>
    // <main className="bg-background text-primary flex min-h-screen flex-col items-center justify-center">
    //   {/* <h2 className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-2 bg-gradient-to-b from-neutral-800 via-white to-white bg-clip-text text-center text-3xl font-medium tracking-tight text-transparent md:flex-row md:gap-8 md:text-5xl md:leading-tight">
    //     <span>Shooting Star</span>
    //     <span className="text-lg font-thin text-white">x</span>
    //     <span>Star Background</span>
    //   </h2> */}

    //   {/* <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-2 bg-gradient-to-b from-neutral-800 via-white to-white bg-clip-text text-center text-3xl font-medium tracking-tight text-transparent md:flex-row md:gap-8 md:text-5xl md:leading-tight">
    //     <Carousel slides={[1, 2, 3]} options={{ align: "start" }} />
    //   </div> */}

    //   <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-2 bg-gradient-to-b from-neutral-800 to-white bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent sm:bg-gradient-to-t md:gap-8 md:text-6xl md:leading-tight">
    //     {/* <GlareCard bgImage="/amex-gold.png" />
    //     <GlareCard bgImage="/BofA-default.jpeg" />
    //     <GlareCard bgImage="/chase-freedom-unlimited.png" /> */}

    //     <div className="flex flex-wrap items-end justify-center gap-6">
    //       <span>Maximize your </span>
    //       <ContainerTextFlip words={["savings", "rewards", "profits"]} />
    //     </div>

    //     <Button>Get Started</Button>
    //   </div>

    //   <ShootingStars />
    //   <StarsBackground />
    // </main>
  );
}
