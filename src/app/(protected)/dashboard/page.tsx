"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { useSession } from "next-auth/react";

import Loader from "@/components/Loader";
import Container from "@/components/Container";
import Carousel from "@/components/carousel/Carousel";
import PageContainer from "@/components/PageContainer";

import { type CardDetails } from "@/lib/types";
import Button from "@/components/ui/button";

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
    <PageContainer className="justify-center">
      <div className="flex w-full flex-col items-center gap-y-12">
        <div className="flex w-full justify-around">
          <Container className="flex h-full w-5/12 md:p-8">
            <div className="border-border md:p4 flex w-full flex-1 flex-col justify-between gap-y-4 rounded-xl border-2 p-4">
              <h3 className="text-2xl font-medium tracking-wide">My Savings</h3>

              <span className="text-right text-[250px] font-medium">$0</span>
            </div>
          </Container>

          <Container className="flex w-5/12 md:p-8">
            <div className="border-border md:p4 flex w-full flex-1 flex-col gap-y-4 rounded-xl border-2 p-4">
              <div className="flex w-full items-center justify-between">
                <h3 className="text-2xl font-medium tracking-wide">My Cards</h3>
                <Link href="/add-card">
                  <FiPlus size="1.5rem" cursor="pointer" />
                </Link>
              </div>

              {loading && (
                <div className="flex flex-1 items-center justify-center">
                  <Loader />
                </div>
              )}

              {!loading && !!myCards?.length && (
                <Carousel slides={myCards ?? []} options={{ align: "start" }} />
              )}
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
