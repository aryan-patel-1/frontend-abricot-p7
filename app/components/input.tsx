import Image from "next/image";
import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function TextInput({
  id,
  label,
  className = "",
  ...props
}: TextInputProps) {
  return (
    // affiche un champ
    <label className={`flex w-full flex-col gap-[7px] ${className}`} htmlFor={id}>
      <span className="text-sm font-normal leading-[1.2] text-[var(--color-ink)]">
        {label}
      </span>
      <input
        id={id}
        className="h-[53px] w-full rounded border border-[var(--color-field-line)] bg-white px-3.5 text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
        {...props}
      />
    </label>
  );
}

type InputCalendarIconProps = {
  className?: string;
};

export function InputCalendarIcon({
  className = "",
}: InputCalendarIconProps) {
  return (
    <Image
      src="/img/input-icon-calendar.svg"
      alt=""
      width={15}
      height={17}
      aria-hidden="true"
      className={`block flex-none ${className}`}
    />
  );
}

export function InputCalendarOrangeIcon({
  className = "",
}: InputCalendarIconProps) {
  return (
    <Image
      src="/img/input-icon-calendar-orange.png"
      alt=""
      width={15}
      height={17}
      aria-hidden="true"
      className={`block flex-none ${className}`}
    />
  );
}

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function SearchInput({
  className = "",
  label,
  ...props
}: SearchInputProps) {
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
