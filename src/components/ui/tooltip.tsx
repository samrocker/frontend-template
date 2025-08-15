// src/components/ui/Tooltip.tsx
"use client";

import { useState, ReactNode } from "react";
import clsx from "clsx";

export type TooltipProps = {
  label: string; // <- REQUIRED to match Sidebar usage
  side?: "right" | "left" | "top" | "bottom";
  className?: string;
  children: ReactNode;
};

export default function Tooltip({
  label,
  side = "right",
  className,
  children,
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  const pos =
    side === "right"
      ? "left-full ml-2"
      : side === "left"
      ? "right-full mr-2"
      : side === "top"
      ? "bottom-full mb-2"
      : "top-full mt-2";

  return (
    <div
      className={clsx("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      {open && (
        <div
          role="tooltip"
          className={clsx(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-neutral-800 px-2.5 py-1 text-xs text-neutral-200 shadow-lg ring-1 ring-black/40",
            pos
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
}
