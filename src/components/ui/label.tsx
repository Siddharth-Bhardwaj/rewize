"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-primary text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white",
      className,
    )}
    {...props}
  />
));

Label.displayName = "Label";

export default Label;
