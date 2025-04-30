"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";
import { FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FaRegFaceSadCry } from "react-icons/fa6";

import PopUp from "@/components/PopUp";
import Button from "@/components/ui/button";
import Carousel from "@/components/carousel/Carousel";

import type { CardRecommendation } from "@/lib/types";
import { showErrorToast, showSuccessToast } from "@/lib/toastFunctions";

const JetPath = () => {
  const cartValue = 1400;
  const categoryIds = ["d7e1e367-e97c-4889-854f-755de34eebda"];

  const router = useRouter();

  const [recommendedCards, setRecommendedCards] =
    useState<CardRecommendation[]>();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [index, setIndex] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    const getRecommendedCard = async () => {
      try {
        type GetRecommendationResponse = {
          message?: string;
          recommendations?: CardRecommendation[];
        };

        const payload = { categoryIds };

        setLoading(true);

        const res = await axios.post<GetRecommendationResponse>(
          "/api/user/card/recommend",
          payload
        );
        const message = res?.data?.message;
        const recommendations = res?.data?.recommendations;

        if (recommendations) {
          setIndex(0);
          setRecommendedCards(recommendations);
        } else if (message) {
          setMessage(message);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    void getRecommendedCard();
  }, []);

  const handlePayment = useCallback(async () => {
    try {
      if (index === null || isNaN(index)) {
        showErrorToast("Payment failed");
        return;
      }

      const card = recommendedCards?.[index];

      if (!card) {
        showErrorToast("Payment failed");
        return;
      }

      const payload = {
        cartValue,
        cardId: card.cardId,
        categoryId: card.categoryId,
      };
      await axios.post("/api/user/savings", payload);

      showSuccessToast("Payment Successful!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      showErrorToast("Payment Unsuccessful!");
    }
  }, [router, index, recommendedCards]);

  const togglePopup = () => setShowPopup((prev) => !prev);

  return (
    <div className="flex w-screen flex-col items-center lg:h-screen">
      <PopUp open={showPopup}>
        <div className="flex items-center justify-between">
          <span className="text-muted text-base tracking-wide">
            Our Recommendations
          </span>

          <FiX
            size="1.5rem"
            cursor="pointer"
            onClick={togglePopup}
            className="text-muted transition-all hover:scale-110"
          />
        </div>

        {!recommendedCards?.length && (
          <div className="flex flex-1 flex-col items-center justify-center gap-y-12">
            <FaRegFaceSadCry size="10rem" className="text-muted/80" />

            <span className="text-muted/80 text-center text-sm">{message}</span>
          </div>
        )}

        {!!recommendedCards?.length && (
          <Carousel
            hideControls
            loading={loading}
            setIndex={setIndex}
            slides={recommendedCards ?? []}
          >
            <div className="mt-4 flex w-full justify-center">
              <Button
                hideIcon
                loading={loading}
                disabled={loading}
                handleClick={handlePayment}
              >
                Pay with Card
              </Button>
            </div>
          </Carousel>
        )}
      </PopUp>

      <div className="flex w-full items-center border-b border-b-neutral-600 px-8 py-6">
        <h1 className="text-2xl font-semibold tracking-wide text-neutral-800">
          JetPath
        </h1>
      </div>

      <div className="flex w-full flex-1 items-center gap-y-12 py-12 max-lg:flex-col lg:w-3/4 lg:justify-around lg:py-20">
        <div className="flex w-full flex-col gap-y-8 px-12 lg:w-1/3 lg:px-20">
          <div className="flex items-start gap-x-8">
            <div className="flex flex-col">
              <span className="text-base font-medium">JFK - LHR</span>
              <span className="text-xs text-gray-400">12 June, 2025</span>

              <span className="text-xs text-gray-600">$500</span>
            </div>
          </div>

          <hr className="max-md:mx-auto max-md:w-10/12" />

          <div className="flex items-start gap-x-8">
            <div className="flex flex-col">
              <span className="text-base font-medium">LHR - SYD</span>
              <span className="text-xs text-gray-400">25 August, 2025</span>

              <span className="text-xs text-gray-600">$900</span>
            </div>
          </div>
        </div>

        <div className="border-neutral-500 max-md:w-full max-md:border-b lg:h-full lg:border-l" />

        <div className="flex w-1/3 flex-col items-center">
          <div className="w-60">
            <div className="flex w-full flex-col gap-y-6 lg:h-48">
              <div className="bg-background flex items-center justify-center gap-x-1 rounded-md py-1">
                <FaApple color="white" />
                <span className="text-primary">Pay</span>
              </div>

              <button
                onClick={togglePopup}
                className="border-border flex w-full cursor-pointer items-center justify-center rounded-md border-2 py-1 transition hover:scale-105"
              >
                <span>Pay with Rewize</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JetPath;
