"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { FaApple } from "react-icons/fa";
import { FaRegFaceSadCry } from "react-icons/fa6";

import PopUp from "@/components/PopUp";
import Carousel from "@/components/carousel/Carousel";

import type { CardRecommendation } from "@/lib/types";

const Amazon = () => {
  const categoryIds = ["b1225fce-2154-43ec-b6e3-65ae44a7a9a3"];

  const [recommendedCards, setRecommendedCards] =
    useState<CardRecommendation[]>();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
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
            slides={recommendedCards ?? []}
          />
        )}
      </PopUp>

      <div className="flex w-full items-center border-b border-b-neutral-600 px-8 py-6">
        <h1 className="text-2xl font-semibold tracking-wide text-neutral-800">
          Amazon
        </h1>
      </div>

      <div className="flex w-full flex-1 items-center gap-y-12 py-12 max-lg:flex-col lg:w-3/4 lg:justify-around lg:py-20">
        <div className="flex w-full flex-col gap-y-8 px-12 lg:w-1/3 lg:px-20">
          <div className="flex items-start gap-x-8">
            <Image
              alt=""
              width={80}
              height={80}
              draggable={false}
              className="h-20 w-20"
              src="/power-bank.webp"
            />

            <div className="flex flex-col">
              <span>Power Bank</span>

              <span className="text-xs text-gray-600">$50</span>
            </div>
          </div>

          <hr className="max-md:mx-auto max-md:w-10/12" />

          <div className="flex items-start gap-x-8">
            <Image
              alt=""
              width={80}
              height={80}
              src="/britta.jpg"
              className="h-20 w-20"
              draggable={false}
            />

            <div className="flex flex-col">
              <span>Britta</span>

              <span className="text-xs text-gray-600">$30</span>
            </div>
          </div>

          <hr className="max-md:mx-auto max-md:w-10/12" />

          <div className="flex items-start gap-x-8">
            <Image
              alt=""
              width={80}
              height={80}
              src="/ps5.jpg"
              className="h-20 w-20"
              draggable={false}
            />

            <div className="flex flex-col">
              <span>PS5</span>

              <span className="text-xs text-gray-600">$800</span>
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

export default Amazon;
