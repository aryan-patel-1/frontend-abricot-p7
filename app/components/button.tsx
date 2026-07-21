import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

// conserve les attributs natifs tout en appliquant le style d'action commun
export default function Button({
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-[50px] cursor-pointer items-center justify-center rounded-lg border-0 bg-[var(--color-action)] px-7 py-3 text-center text-base font-normal leading-tight text-white transition-[background-color,transform] duration-150 hover:bg-[var(--color-ink)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-[0.68] disabled:active:translate-y-0 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
