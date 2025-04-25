"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "@/lib/utils";

interface PopupProps {
  open?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const PopUp: React.FC<PopupProps> = ({ open, children, className }) => {
  return (
    <AnimatePresence presenceAffectsLayout={false}>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed top-0 left-0 z-50 flex h-screen w-screen items-end justify-center overflow-hidden md:items-center"
          )}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-modal-overlay absolute inset-0"
          />

          <motion.div
            initial={{ transform: "scale(0)" }}
            animate={{ transform: "scale(1)" }}
            exit={{ transform: "scale(0)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              boxShadow:
                "0 0 0 14px #121212, 0 0 0 17px #232323, 0 20px 40px rgba(0, 0, 0, 0.8)",
            }}
            className="bg-background absolute flex w-full flex-col shadow-2xl max-md:rounded-t-2xl max-md:p-4 max-sm:shadow-none md:h-full md:rounded-4xl lg:h-[600px] lg:w-[300px] 2xl:h-[812px] 2xl:w-[375px]"
          >
            <div className="bg-surface flex h-full w-full flex-col items-center gap-y-4 p-4 max-md:rounded-t-2xl md:rounded-4xl">
              <div
                id="notch"
                className="h-8 w-28 rounded-3xl bg-black max-md:hidden"
              />
              <div className={cn("flex w-full flex-1 flex-col", className)}>
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopUp;
