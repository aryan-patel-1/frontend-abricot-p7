import Image from "next/image";

export default function Footer() {
  return (
    // affiche le bas de page
    <footer className="flex h-[68px] w-full flex-none items-center justify-between bg-white py-0 pl-[30px] pr-[55px] max-sm:px-6">
      <Image
        src="/img/logo-noir.svg"
        alt="Abricot"
        width={253}
        height={33}
        className="block h-auto w-[102px]"
      />
      <span className="text-base font-normal leading-none text-[var(--color-ink)]">
        Abricot 2025
      </span>
    </footer>
  );
}
