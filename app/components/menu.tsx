import Image from "next/image";
import Link from "next/link";

import styles from "../css/menu.module.css";
import MenuItems from "./menuItems";
import UserIcon from "./userIcon";

type MenuProps = {
  pathname: string;
};

export default function Menu({ pathname }: MenuProps) {
  return (
    // affiche le menu du haut
    <header className={styles.menu}>
      <Link className={styles.logoLink} href="/dashboard" aria-label="Abricot">
        <Image
          src="/img/logo-orange.svg"
          alt="Abricot"
          width={253}
          height={33}
          className={styles.logo}
          priority
        />
      </Link>

      <nav className={styles.nav} aria-label="navigation principale">
        <MenuItems
          href="/dashboard"
          icon="dashboard"
          label="Tableau de bord"
          active={pathname.startsWith("/dashboard")}
        />
        <MenuItems
          href="/projects"
          icon="projects"
          label="Projets"
          active={pathname.startsWith("/projects")}
        />
      </nav>

      <div className={styles.profile}>
        <UserIcon />
      </div>
    </header>
  );
}