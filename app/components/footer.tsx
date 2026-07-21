import Image from "next/image";

// centralise le pied de page partagé par les écrans authentifiés
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex h-[68px] w-full flex-none items-center justify-between bg-white py-0 pl-[30px] pr-[55px] max-sm:px-6">
      <Image
        src="/img/logo-noir.svg"
        alt=""
        width={253}
        height={33}
        className="block h-auto w-[102px]"
      />
      <span className="text-base font-normal leading-none text-[var(--color-ink)]">
        Abricot {currentYear}
      </span>
    </footer>
  );
}
