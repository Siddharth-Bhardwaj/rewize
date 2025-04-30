"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FiArrowRight } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";

import Label from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/PrimaryButton";
import LabelInputContainer from "@/components/LabelInputContainer";

import { showErrorToast } from "@/lib/toastFunctions";

type ErrorResponse = {
  error: { message: string }[];
};

const SignupLayout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("callbackUrl") ?? "/dashboard";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { name, email, password } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    try {
      setLoading(true);

      await axios.post("/api/auth/signup", formData);

      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!loginRes?.error && loginRes?.ok && loginRes?.url) {
        router.push(redirectTo);
      } else {
        showErrorToast("Invalid email or password");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const res = error?.response?.data as ErrorResponse;

        if (res?.error?.[0]?.message) {
          showErrorToast(res.error[0].message);
        } else {
          showErrorToast("Unexpected error occurred.");
        }
      } else {
        showErrorToast("Unexpected error.");
      }
    } finally {
      setLoading(false);
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

      <PrimaryButton
        loading={loading}
        disabled={loading}
        handleClick={handleSignup}
      >
        Sign Up
      </PrimaryButton>

      <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent md:my-8 dark:via-neutral-700" />

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
