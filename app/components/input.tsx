import Image from "next/image";
import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  // ajoute une icône à droite du champ seulement si une source est fournie
  iconSrc?: string;
  label: string;
  // conserve le champ classique par défaut et permet le style barre de recherche
  variant?: "default" | "search";
};

export default function TextInput({
  id,
  iconSrc,
  label,
  className = "",
  variant = "default",
  ...props
}: TextInputProps) {
  // centralise le choix des styles pour éviter deux composants presque identiques
  const isSearch = variant === "search";

  return (
    // le label englobe le champ pour conserver une zone cliquable et accessible
    <label
      className={`${
        isSearch
          ? "flex h-[63px] w-full max-w-[357px] items-center justify-between rounded-lg border border-[var(--color-line)] bg-white px-[31px] text-[15px] text-[var(--color-muted)]"
          : "flex w-full flex-col gap-[7px]"
      } ${className}`}
      htmlFor={id}
    >
      {/* garde le label lisible par les lecteurs d'écran dans la barre de recherche */}
      <span
        className={
          isSearch
            ? "sr-only"
            : "text-sm font-normal leading-[1.2] text-[var(--color-ink)]"
        }
      >
        {label}
      </span>
      {/* transmet value, onChange, placeholder et les autres attributs natifs */}
      <input
        id={id}
        className={
          isSearch
            ? "min-w-0 flex-1 border-0 bg-transparent p-0 text-[15px] leading-none text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
            : "h-[53px] w-full rounded border border-[var(--color-field-line)] bg-white px-3.5 text-[var(--color-ink)] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--color-brand)] focus:shadow-[var(--shadow-input-focus)]"
        }
        {...props}
      />
      {/* affiche l'icône sans la rendre obligatoire pour les champs classiques */}
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt=""
          width={14}
          height={14}
          aria-hidden="true"
          className="block h-[14px] w-[14px] flex-none"
        />
      ) : null}
    </label>
  );
}

type InputIconProps = {
  className?: string;
  src: string;
};

export function InputIcon({
  className = "",
  src,
}: InputIconProps) {
  return (
    <Image
      src={src}
      alt=""
      width={15}
      height={17}
      aria-hidden="true"
      className={`block flex-none ${className}`}
    />
  );
}
