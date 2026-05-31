import Image from "next/image";

import { InputCalendarOrangeIcon } from "./input";

export type DashboardView = "list" | "kanban";

type ChipsProps = {
  className?: string;
};

export default function Chips({ className = "" }: ChipsProps) {
  return (
    <Image
      src="/img/chips-mes-taches.svg"
      alt=""
      width={16}
      height={16}
      aria-hidden="true"
      className={`block flex-none ${className}`}
    />
  );
}

type ViewTabsProps = {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
};

// affiche les onglets de vue du tableau de bord
export function ViewTabs({ activeView, onViewChange }: ViewTabsProps) {
  const baseClass =
    "inline-flex h-[45px] items-center gap-[10px] rounded-lg px-[17px] text-sm leading-none text-[var(--color-brand)]";
  const activeClass = "bg-[var(--color-brand-soft)]";
  const inactiveClass = "bg-white";

  return (
    <div className="flex flex-wrap items-center gap-[10px]">
      <button
        type="button"
        aria-pressed={activeView === "list"}
        className={`${baseClass} ${
          activeView === "list" ? activeClass : inactiveClass
        }`}
        onClick={() => onViewChange("list")}
      >
        <Chips className="h-4 w-4" />
        <span>Liste</span>
      </button>
      <button
        type="button"
        aria-pressed={activeView === "kanban"}
        className={`${baseClass} ${
          activeView === "kanban" ? activeClass : inactiveClass
        }`}
        onClick={() => onViewChange("kanban")}
      >
        <InputCalendarOrangeIcon className="h-[17px] w-[15px]" />
        <span>Kanban</span>
      </button>
    </div>
  );
}
