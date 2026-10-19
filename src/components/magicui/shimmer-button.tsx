"use client";

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "rgba(56, 189, 248, 0.7)",
      shimmerSize = "0.1em",
      shimmerDuration = "3s",
      borderRadius = "14px",
      background = "#0284c7",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 inline-flex items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
          "rounded-[var(--radius)] bg-[var(--bg)]",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer sweep effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
        
        {/* Subtle top inner highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/40 pointer-events-none" />

        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
