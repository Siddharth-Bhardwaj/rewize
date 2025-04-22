"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FiArrowRight } from "react-icons/fi";
import { useSearchParams } from "next/navigation";

import Label from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/PrimaryButton";
import LabelInputContainer from "@/components/LabelInputContainer";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("callbackUrl") ?? "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirectTo,
      });

      console.log(loginRes);
    } catch (error) {
    } finally {
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-4">
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

      <PrimaryButton handleClick={handleLogin}>Login</PrimaryButton>

      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <span className="text-center text-sm tracking-wide text-white/60">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-x-0.5 text-white"
        >
          <span>Sign Up</span>
          <FiArrowRight strokeWidth={2.75} />
        </Link>
      </span>
    </>
  );
};

export default LoginPage;
