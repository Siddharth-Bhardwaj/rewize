"use client";

import React from "react";

import PageContainer from "@/components/PageContainer";
import AnimatedUsers from "@/components/ui/animated-users";

import { contributors } from "@/lib/metadata";

const AboutPage = () => {
  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="mb-4 text-center">
          <h2 className="mb-4 text-3xl font-semibold text-white md:text-4xl">
            🚀 About Us
          </h2>
          <p className="text-muted mx-auto max-w-2xl text-base md:text-lg">
            We’re a team of NYU Computer Science graduate students who share a
            passion for building smart, scalable, and delightful tech. When
            we’re not buried in algorithms or late-night sprints, we’re dreaming
            up products that make life simpler and smarter.
          </p>
        </div>

        <AnimatedUsers autoplay contributors={contributors} />
      </div>
    </PageContainer>
  );
};

export default AboutPage;
