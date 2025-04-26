"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { type EmblaOptionsType } from "embla-carousel";

import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./CarouselArrowButtons";
import LoadingCard from "../LoadingCard";
import { GlareCard } from "../ui/glare-card";
import { DotButton, useDotButton } from "./CarouselDotButton";

import { cn } from "@/lib/utils";
import type { CardDetails, CardRecommendation } from "@/lib/types";

type PropType = {
  loading?: boolean;
  className?: string;
  hideControls?: boolean;
  options?: EmblaOptionsType;
  slides: (CardDetails | CardRecommendation)[];
};

type Slide = CardDetails | CardRecommendation;

const Carousel: React.FC<PropType> = (props) => {
  const { slides, options, loading, className, hideControls } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className={cn("embla", "w-full", className)}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {/* TODO: fix animation */}
          {loading && (
            <div className="embla__slide">
              <div className="embla__slide__number">
                <LoadingCard />
              </div>
            </div>
          )}

          {!loading &&
            slides.map((card: Slide | undefined, index) => {
              const key =
                typeof card === "object" && card !== null
                  ? "id" in card
                    ? card.id
                    : "cardId" in card
                      ? card.cardId + index
                      : index
                  : index;

              return (
                <div className="embla__slide" key={key}>
                  <div className="embla__slide__number">
                    {card?.imageUrl && (
                      <GlareCard image={card.imageUrl ?? ""} />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {slides?.[selectedIndex] && "message" in slides[selectedIndex] && (
        <div className="flex justify-center">
          <span className="text-primary text-center text-sm tracking-wide">
            {slides[selectedIndex]?.message ?? ""}
          </span>
        </div>
      )}

      {!hideControls && (
        <div className="embla__controls">
          <div
            className={`embla__buttons ${slides?.length < 2 ? "pointer-events-none opacity-0" : ""}`}
          >
            <PrevButton
              disabled={prevBtnDisabled}
              onClick={onPrevButtonClick}
            />
            <NextButton
              disabled={nextBtnDisabled}
              onClick={onNextButtonClick}
            />
          </div>

          {/* <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? "embla__dot--selected" : "",
              )}
            />
          ))}
        </div> */}
        </div>
      )}
    </section>
  );
};

export default Carousel;
