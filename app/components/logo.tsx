import Image from "next/image";

type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    // affiche le logo
    <Image
      src="/img/logo-orange.svg"
      alt="Abricot"
      width={253}
      height={33}
      className={`block h-auto w-[253px] ${className}`}
      preload
    />
  );
}
