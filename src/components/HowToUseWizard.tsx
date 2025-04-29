"use client";

import React, { Fragment } from "react";
import { motion } from "motion/react";

const steps = [
  { label: "Add Your Cards", emoji: "💳" },
  { label: "Browse a Merchant", emoji: "🛍️" },
  { label: "Pick the Best Card", emoji: "💰" },
];

const container = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const horizontalStep = {
  initial: { opacity: 0, x: -50 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const verticalStep = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const HowToUseWizard = () => {
  return (
    <motion.div
      variants={container}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center space-y-8 sm:flex-row sm:items-center sm:justify-center sm:space-y-0 sm:space-x-10"
    >
      {steps.map((currStep, index) => {
        return (
          <Fragment key={index}>
            <motion.div
              variants={verticalStep}
              className="relative hidden flex-col items-center text-white max-sm:flex"
            >
              <div className="z-10 flex h-18 w-40 items-center justify-center rounded-md border-4 border-white font-semibold text-black shadow-lg">
                <div className="flex h-full flex-1 items-center justify-center px-3">
                  <span className="text-center text-base leading-tight text-white">
                    {currStep.emoji}
                  </span>
                </div>

                <div className="basis flex h-full items-center justify-center border-l-4 border-white px-2">
                  <span className="text-center text-sm font-medium text-white">
                    {currStep.label}
                  </span>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute -bottom-[15%] block h-1 w-[15%] transform bg-white max-sm:rotate-90 sm:top-1/2 sm:right-[-19.5%] sm:w-[19.5%] sm:-translate-y-1/2">
                  <div className="absolute top-1/2 right-[-6px] h-[13px] w-[13px] -translate-y-1/2 -rotate-45 transform border-r-4 border-b-4 sm:block" />
                </div>
              )}
            </motion.div>

            <motion.div
              variants={horizontalStep}
              className="relative hidden flex-col items-center text-white sm:flex"
            >
              <div className="z-10 flex h-18 w-40 items-center justify-center rounded-md border-4 border-white font-semibold text-black shadow-lg">
                <div className="flex h-full flex-1 items-center justify-center px-3">
                  <span className="text-center text-base leading-tight text-white">
                    {currStep.emoji}
                  </span>
                </div>

                <div className="basis flex h-full items-center justify-center border-l-4 border-white px-2">
                  <span className="text-center text-sm font-medium text-white">
                    {currStep.label}
                  </span>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute -bottom-[15%] block h-1 w-[15%] transform bg-white max-sm:rotate-90 sm:top-1/2 sm:right-[-19.5%] sm:w-[19.5%] sm:-translate-y-1/2">
                  <div className="absolute top-1/2 right-[-6px] h-[13px] w-[13px] -translate-y-1/2 -rotate-45 transform border-r-4 border-b-4 sm:block" />
                </div>
              )}
            </motion.div>
          </Fragment>
        );
      })}
    </motion.div>
  );
};

export default HowToUseWizard;
