"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { FaCreditCard } from "react-icons/fa";

import Label from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Container from "@/components/Container";
import PageContainer from "@/components/PageContainer";
import { GlareCard } from "@/components/ui/glare-card";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Select, { type Option } from "@/components/ui/select";
import LabelInputContainer from "@/components/LabelInputContainer";

import type { CardDetails } from "@/lib/types";

const RenderIcon = () => {
  return <FaCreditCard />;
};

const AddCardPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [cards, setCards] = useState<CardDetails[] | null>([]);
  const [cardData, setCardData] = useState<CardDetails | null>(null);

  useEffect(() => {
    const fetchAllCards = async () => {
      try {
        type GetAllCardsResponse = {
          cards: CardDetails[];
        };

        setLoading(true);

        const res = await axios.get<GetAllCardsResponse>("/api/cards/all");
        let cards = res.data?.cards ?? [];
        cards = cards?.map((card) => ({
          ...card,
          value: card?.id,
          label: card?.name,
        }));

        setCards(cards);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    void fetchAllCards();
  }, []);

  const handleSave = async () => {
    try {
      if (!cardData?.id) return;

      const payload = { cardId: cardData?.id };
      await axios.post("/api/user/card", payload);
    } catch (error) {}
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-around">
        <Container className="w-5/12 md:p-8">
          <div className="border-border md:p4 flex aspect-square w-full flex-col gap-y-6 rounded-xl border-2 p-4">
            <h3 className="text-2xl font-medium tracking-wide">
              Enter Card Details
            </h3>

            <LabelInputContainer>
              <Label>Name on Card</Label>

              <Input />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label>Credit Card Number</Label>

              <div className="flex w-full items-center gap-x-4">
                <RenderIcon />

                <Input className="w-full flex-1" />
              </div>
            </LabelInputContainer>

            <Select
              loading={loading}
              options={cards as Option[]}
              onValueChange={(id) => {
                const selected = cards?.find((card) => card.id === id);
                setCardData(selected!);
              }}
            />

            <div className="flex items-center justify-between gap-x-8">
              <LabelInputContainer>
                <Label>Expiry Date</Label>

                <Input placeholder="MM / YY" />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label>Security Code</Label>

                <Input />
              </LabelInputContainer>
            </div>

            <PrimaryButton handleClick={handleSave}>Save Card</PrimaryButton>
          </div>
        </Container>

        {cardData && (
          <Container className="w-5/12 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="border-border md:p4 flex aspect-square w-full flex-col items-center justify-center gap-y-6 rounded-xl border-2 p-4"
            >
              <GlareCard image={cardData?.imageUrl ?? ""} />
              <span className="text-lg">{cardData?.name}</span>
            </motion.div>
          </Container>
        )}
      </div>
    </PageContainer>
  );
};

export default AddCardPage;
