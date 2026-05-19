import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-brand-amber text-brand-black hover:bg-brand-orange hover:box-glow": variant === "primary",
          "bg-white/10 text-white hover:bg-white/20": variant === "secondary",
          "glass text-white hover:bg-white/10": variant === "glass",
          "border border-brand-amber text-brand-amber hover:bg-brand-amber/10": variant === "outline",
          "h-9 px-4 text-sm": size === "sm",
          "h-11 px-6 text-base": size === "md",
          "h-14 px-8 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
