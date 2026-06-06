import Link from "next/link";

type UserIconProps = {
  active?: boolean;
  name?: string;
};

function getInitials(name: string) {
  // garde les deux premières lettres du nom pour l'avatar
  return name.trim().slice(0, 2).toUpperCase();
}

export default function UserIcon({
  active = false,
  name = "Admin",
}: UserIconProps) {
  const initials = getInitials(name);
  const activeClass = active
    ? "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)]"
    : "bg-[var(--color-brand-soft)] text-[var(--color-ink)] hover:bg-[var(--color-brand-soft-hover)]";

  return (
    // affiche les initiales
    <Link
      className={`inline-flex h-[65px] w-[65px] items-center justify-center rounded-full text-sm font-normal leading-none no-underline ${activeClass}`}
      href="/main/account"
      aria-label="profil utilisateur"
    >
      {initials}
    </Link>
  );
}
