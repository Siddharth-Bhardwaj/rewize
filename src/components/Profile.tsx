"use client";

import React, { useRef, useState, type ChangeEvent } from "react";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FiEdit3, FiUser } from "react-icons/fi";

import { Input } from "./ui/input";
import PrimaryButton from "./ui/PrimaryButton";

import { cn } from "@/lib/utils";
import { showErrorToast, showSuccessToast } from "@/lib/toastFunctions";

const Profile = () => {
  const { data: session, update } = useSession();

  const [image, setImage] = useState<string | null>(
    session?.user?.image ?? null
  );
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(session?.user.name ?? "");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (editing) {
      inputRef?.current?.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target?.files?.[0];

      if (!file) return;

      const url = URL.createObjectURL(file);
      setImage(url);
      setFile(file);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      type PutProfileResponse = {
        user: { name: string; image: string | null };
      };

      const formData = new FormData();
      formData.append("name", name);

      if (file) {
        formData.append("file", file);
      }

      setLoading(true);

      const res = await axios.put<PutProfileResponse>(
        "/api/user/profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const user = res?.data?.user;

      await update({ user });

      toggleEditing();
      showSuccessToast("Profile updated successfully!");
    } catch (error) {
      showErrorToast("Profile save unsuccessful!");
    } finally {
      setLoading(false);
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="border-muted flex w-full flex-col rounded-xl border-2 pt-8 sm:w-2/5 sm:min-w-xl">
        <div className="bg-muted h-10 w-full" />

        <div className="flex gap-x-6 p-8">
          <div className="relative flex h-48 w-42 items-center justify-center overflow-hidden rounded-md border-2">
            <input
              hidden
              type="file"
              ref={inputRef}
              accept="image/*"
              onChange={handleFileChange}
            />

            <div
              onClick={handleUploadClick}
              className={cn(
                "absolute inset-0 transition-colors ease-linear",
                editing ? "hover:bg-modal-overlay cursor-pointer" : ""
              )}
            />

            {image ? (
              <Image
                width={164}
                height={188}
                src={image}
                alt="profile pic"
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <FiUser size="7rem" strokeWidth={1.2} />
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div className="flex justify-end">
              {!editing ? (
                <FiEdit3
                  size="1.5rem"
                  cursor="pointer"
                  strokeWidth={1.5}
                  onClick={toggleEditing}
                  className="transition-all hover:scale-110"
                />
              ) : (
                <PrimaryButton
                  loading={loading}
                  disabled={loading}
                  handleClick={handleSubmit}
                >
                  SAVE
                </PrimaryButton>
              )}
            </div>

            <div className="">
              {!editing ? (
                <span className="font-mono text-2xl tracking-widest uppercase">
                  {name}
                </span>
              ) : (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-mono text-2xl tracking-wider"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
