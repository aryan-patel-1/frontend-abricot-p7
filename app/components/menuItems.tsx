import Link from "next/link";

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
  const itemClass = active
    ? "bg-[#111111] text-white hover:text-white"
    : "text-[#d3590b] hover:text-[#a94308]";

  function renderIcon() {
    if (icon === "dashboard") {
      return (
        <span
          className="grid h-6 w-6 flex-none grid-cols-[repeat(2,10px)] grid-rows-[repeat(2,10px)] gap-1 text-current"
          aria-hidden="true"
        >
          <span className="block rounded-[2px] bg-current" />
          <span className="block rounded-[2px] bg-current" />
          <span className="block rounded-[2px] bg-current" />
          <span className="block rounded-[2px] bg-current" />
        </span>
      );
    }

    return (
      <span
        className="relative h-6 w-7 flex-none text-current"
        aria-hidden="true"
      >
        <span className="absolute left-0 top-px h-[7px] w-[13px] rounded-t-[2px] bg-current" />
        <span className="absolute left-2 top-[3px] h-[5px] w-5 rounded-t-[2px] bg-current" />
        <span className="absolute left-0 top-[6px] h-[17px] w-7 rounded-t-[2px] rounded-b-[3px] bg-current" />
      </span>
    );
  }

  return (
    // affiche un lien du menu
    <Link
      className={`inline-flex min-h-[78px] items-center gap-[18px] whitespace-nowrap rounded-lg px-[42px] text-base font-normal leading-none no-underline ${itemClass}`}
      href={href}
    >
      {renderIcon()}
      <span>{label}</span>
    </Link>
  );
}
