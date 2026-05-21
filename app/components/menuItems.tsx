import Link from "next/link";

import styles from "../css/menuItems.module.css";

type MenuItemsProps = {
  active?: boolean;
  href: string;
  icon: "dashboard" | "projects";
  label: string;
};

export default function MenuItems({
  active = false,
  href,
  icon,
  label,
}: MenuItemsProps) {
  const iconClass =
    icon === "dashboard" ? styles.dashboardIcon : styles.projectsIcon;
  const itemClass = active ? `${styles.item} ${styles.active}` : styles.item;

  return (
    // affiche un lien du menu
    <Link className={itemClass} href={href}>
      <span className={`${styles.icon} ${iconClass}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span>{label}</span>
    </Link>
  );
}