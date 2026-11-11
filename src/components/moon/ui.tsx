import type { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "good" | "warn" | "signal";
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 font-display text-sm font-semibold tracking-wide transition-[transform,filter,background-color,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" && "bg-accent text-bg hover:brightness-110",
        variant === "good" && "bg-good text-bg hover:brightness-110",
        variant === "warn" && "bg-warn text-bg hover:brightness-110",
        variant === "signal" && "bg-signal text-bg hover:brightness-110",
        variant === "ghost" && "bg-surface-2 text-fg shadow-card hover:brightness-110",
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("glass rounded-3xl p-4", className)}>{children}</section>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-xs font-semibold tracking-widest text-accent uppercase">{children}</p>
  );
}
