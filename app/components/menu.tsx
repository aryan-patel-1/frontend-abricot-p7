import Image from "next/image";
import Link from "next/link";

import MenuItems from "./menuItems";
import UserIcon from "./userIcon";

type MenuProps = {
  pathname: string;
};

export default function Menu({ pathname }: MenuProps) {
  return (
    // affiche le menu du haut
    <header className="grid h-[94px] w-full flex-none grid-cols-[1fr_auto_1fr] items-center bg-white pl-[113px] pr-[86px] shadow-[0_4px_14px_rgba(0,0,0,0.14)] max-[900px]:h-auto max-[900px]:min-h-[94px] max-[900px]:grid-cols-[1fr_auto] max-[900px]:gap-6 max-[900px]:px-6 max-[900px]:py-[18px]">
      <Link
        className="inline-flex items-center justify-self-start"
        href="/main/dashboard"
        aria-label="Abricot"
      >
        <Image
          src="/img/logo-orange.svg"
          alt="Abricot"
          width={253}
          height={33}
          className="block h-auto w-[146px]"
          priority
        />
      </Link>

      <nav
        className="flex items-center justify-center gap-32 max-[900px]:col-span-full max-[900px]:row-start-2 max-[900px]:justify-start max-[900px]:gap-8 max-[520px]:flex-col max-[520px]:items-start max-[520px]:gap-[18px]"
        aria-label="navigation principale"
      >
        <MenuItems
          href="/main/dashboard"
          icon="dashboard"
          label="Tableau de bord"
          active={pathname.startsWith("/main/dashboard")}
        />
        <MenuItems
          href="/main/projects"
          icon="projects"
          label="Projets"
          active={pathname.startsWith("/main/projects")}
        />
      </nav>

      <div className="justify-self-end">
        <UserIcon />
      </div>
    </header>
  );
}
