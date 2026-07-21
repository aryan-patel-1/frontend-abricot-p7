import Image from "next/image";

type LogoProps = {
  className?: string;
};

// garde les dimensions et le chargement du logo cohérents entre les pages
export default function Logo({ className = "" }: LogoProps) {
  return (
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
