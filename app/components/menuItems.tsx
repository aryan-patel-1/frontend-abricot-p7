import Image from "next/image";
import Link from "next/link";

type MenuItemsProps = {
  active?: boolean;
  href: string;
  icon: "dashboard" | "projects";
  label: string;
};

type MenuItemIconProps = {
  active?: boolean;
  className?: string;
  icon: MenuItemsProps["icon"];
};

export function MenuItemIcon({
  active = false,
  className = "",
  icon,
}: MenuItemIconProps) {
  const iconSrc =
    icon === "dashboard"
      ? active
        ? "/img/menu-tableau-blanc.svg"
        : "/img/menu-tableau-orange.svg"
      : active
        ? "/img/menu-projet-blanc.svg"
        : "/img/menu-projet-orange.svg";
  const iconWidth = icon === "dashboard" ? 24 : 29;
  const iconHeight = icon === "dashboard" ? 24 : 23;
  const baseClass = icon === "dashboard" ? "h-6 w-6" : "h-[23px] w-[29px]";
  const imageClass = className || baseClass;

  return (
    <Image
      src={iconSrc}
      alt=""
      width={iconWidth}
      height={iconHeight}
      className={`block flex-none ${imageClass}`}
    />
  );
}

// adapte le lien et son icône selon la route actuellement affichée
export default function MenuItems({
  active = false,
  href,
  icon,
  label,
}: MenuItemsProps) {
  const itemClass = active
    ? "bg-[var(--color-ink)] text-white hover:text-white"
    : "text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]";

  return (
    <Link
      className={`inline-flex min-h-[78px] items-center gap-[18px] whitespace-nowrap rounded-lg px-[42px] text-base font-normal leading-none no-underline max-[520px]:min-h-14 max-[520px]:gap-2 max-[520px]:px-2 max-[520px]:text-sm ${itemClass}`}
      href={href}
    >
      <MenuItemIcon active={active} icon={icon} />
      <span>{label}</span>
    </Link>
  );
}
