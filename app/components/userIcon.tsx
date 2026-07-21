import Link from "next/link";

type UserIconProps = {
  active?: boolean;
  name?: string;
};

// limite l'avatar aux initiales du prénom et du nom
function getInitials(name: string) {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  const firstNameInitial = nameParts[0]?.[0] ?? "";
  const lastNameInitial = nameParts[1]?.[0] ?? "";

  return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
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
    <Link
      className={`inline-flex h-[65px] w-[65px] items-center justify-center rounded-full text-sm font-normal leading-none no-underline ${activeClass}`}
      href="/main/account"
      aria-label="profil utilisateur"
    >
      {initials}
    </Link>
  );
}
