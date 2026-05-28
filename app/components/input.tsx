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
      <span className="text-sm font-normal leading-[1.2] text-[#111111]">
        {label}
      </span>
      <input
        id={id}
        className="h-[53px] w-full rounded border border-[#d9dde3] bg-white px-3.5 text-[#111111] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#d3590b] focus:shadow-[0_0_0_3px_rgba(211,89,11,0.14)]"
        {...props}
      />
    </label>
  );
}
