import Image from "next/image";
import type { InputHTMLAttributes } from "react";

type SearchBarProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function SearchBar({
  className = "",
  label,
  ...props
}: SearchBarProps) {
  return (
    <label
      className={`flex h-[63px] w-full max-w-[357px] items-center justify-between rounded-lg border border-[var(--color-line)] bg-white px-[31px] text-[15px] text-[var(--color-muted)] ${className}`}
    >
      <span className="sr-only">{label}</span>
      <input
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] leading-none text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
        {...props}
      />
      <Image
        src="/img/icone-recherche.svg"
        alt=""
        width={14}
        height={14}
        aria-hidden="true"
        className="block h-[14px] w-[14px] flex-none"
      />
    </label>
  );
}
