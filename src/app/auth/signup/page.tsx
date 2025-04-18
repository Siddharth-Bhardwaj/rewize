"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import Label from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/PrimaryButton";
import LabelInputContainer from "@/components/LabelInputContainer";

const SignupLayout = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post("/api/auth/signup", formData);

      console.log(res);
    } catch (error) {
    } finally {
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <LabelInputContainer>
          <Label>Full Name</Label>
          <Input type="text" name="name" value={name} onChange={handleChange} />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </LabelInputContainer>

        <LabelInputContainer>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </LabelInputContainer>
      </div>

      <PrimaryButton handleClick={handleSignup}>Sign Up</PrimaryButton>

      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <span className="text-center text-sm tracking-wide text-white/60">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-x-0.5 text-white"
        >
          <span>Login</span>
          <FiArrowRight strokeWidth={2.75} />
        </Link>
      </span>
    </>
  );
};

export default SignupLayout;
