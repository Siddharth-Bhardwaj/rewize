"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { useSession } from "next-auth/react";

import Button from "@/components/ui/button";
import Container from "@/components/Container";
import Carousel from "@/components/carousel/Carousel";
import PageContainer from "@/components/PageContainer";

import { type CardDetails } from "@/lib/types";

type GetAllCardsResponse = {
  cards: CardDetails[];
};

const DashboardPage = () => {
  const { data: session } = useSession();
  console.log(session, "sesh");

  const [loading, setLoading] = useState<boolean>(true);
  const [myCards, setMyCards] = useState<CardDetails[] | null>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);

        const res = await axios.get<GetAllCardsResponse>("/api/user/card");
        const cards = res?.data?.cards ?? [];

        setMyCards(cards);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    void fetchCards();
  }, []);

  return (
    <PageContainer className="md:justify-center">
      <div className="flex w-full flex-col items-center gap-y-10 md:gap-y-12">
        <div className="flex w-full flex-col justify-around gap-y-8 md:flex-row">
          <Container className="order-2 flex h-full w-full md:order-1 md:w-5/12 md:p-8">
            <div className="border-border md:p4 flex w-full flex-1 flex-col justify-between gap-y-4 rounded-xl border-2 p-4">
              <h3 className="text-2xl font-medium tracking-wide">My Savings</h3>

              <span className="text-right text-[180px] font-medium md:text-[200px] lg:text-[240px]">
                $0
              </span>
            </div>
          </Container>

          <Container className="order-1 flex w-full md:order-2 md:w-5/12 md:p-8">
            <div className="border-border md:p4 flex w-full flex-1 flex-col gap-y-4 rounded-xl border-2 p-4">
              <div className="flex w-full items-center justify-between">
                <h3 className="text-2xl font-medium tracking-wide">My Cards</h3>
                <Link href="/add-card">
                  <FiPlus
                    size="1.5rem"
                    cursor="pointer"
                    strokeWidth={2.5}
                    className="transition-all hover:scale-125 hover:rotate-180"
                  />
                </Link>
              </div>

              <Carousel
                loading={loading}
                slides={myCards ?? []}
                options={{ align: "start" }}
              />
            </div>
          </Container>
        </div>

        <Link href="/how-to-use">
          <Button>See How it Works</Button>
        </Link>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
