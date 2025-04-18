"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import Label from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/PrimaryButton";
import LabelInputContainer from "@/components/LabelInputContainer";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
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
      const res = await axios.post("/api/auth/login", formData);

      console.log(res);
      router.push("/");
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
