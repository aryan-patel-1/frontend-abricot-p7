import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    // affiche un bouton
    <button
      className={`inline-flex h-[50px] cursor-pointer items-center justify-center rounded-lg border-0 bg-[var(--color-action)] px-7 text-base font-normal leading-none text-white transition-[background-color,transform] duration-150 hover:bg-[var(--color-ink)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-[0.68] disabled:active:translate-y-0 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
