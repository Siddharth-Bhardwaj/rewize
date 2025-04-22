"use client";

import React from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import * as SelectPrimitive from "@radix-ui/react-select";

import Loader from "../Loader";

import { cn } from "@/lib/utils";
import type { CardDetails } from "@/lib/types";

export type Option = CardDetails & {
  label: string;
  value: string;
};

interface SelectProps {
  value?: string;
  loading?: boolean;
  options: Option[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  value,
  options,
  onValueChange,
  loading = false,
  placeholder = "Select an option",
}) => {
  const [search, setSearch] = React.useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        className={cn(
          "ring-border bg-surface hover:ring-accent-green focus:ring-accent-green inline-flex items-center justify-between gap-2 rounded-md px-4 py-2 text-sm font-medium text-white ring-1 focus:ring-2 focus:outline-none"
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <FiChevronDown className="h-4 w-4 text-white" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="border-border bg-surface z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border text-sm text-white shadow-xl"
          position="popper"
        >
          {loading ? (
            <div className="text-muted flex items-center justify-center p-4">
              <Loader className="text-accent-green h-5 w-5 animate-spin" />
              <span className="ml-2 text-sm">Loading...</span>
            </div>
          ) : (
            <>
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-background placeholder:text-muted ring-border focus:ring-accent-green w-full rounded-md px-3 py-2 text-sm text-white ring-1 focus:ring-2 focus:outline-none"
                />
              </div>

              <SelectPrimitive.Viewport className="max-h-[200px] overflow-y-auto p-1">
                {filteredOptions.length === 0 ? (
                  <div className="text-muted px-4 py-2 text-sm">
                    No results found.
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <SelectPrimitive.Item
                      key={option.value}
                      value={option.value}
                      className={cn(
                        "hover:bg-accent-green/20 focus:bg-accent-green/20 relative flex cursor-default items-center rounded-sm px-4 py-2 outline-none select-none"
                      )}
                    >
                      <SelectPrimitive.ItemText>
                        {option.label}
                      </SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="absolute right-2 inline-flex items-center">
                        <FiCheck className="text-accent-green h-4 w-4" />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))
                )}
              </SelectPrimitive.Viewport>
            </>
          )}

          {/* <SelectPrimitive.ScrollUpButton className="text-muted flex items-center justify-center px-2 py-1">
            ↑
          </SelectPrimitive.ScrollUpButton>

          <SelectPrimitive.ScrollDownButton className="text-muted flex items-center justify-center px-2 py-1">
            ↓
          </SelectPrimitive.ScrollDownButton> */}
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};

export default Select;
