import Link from "next/link";

type UserIconProps = {
  initials?: string;
};

export default function UserIcon({ initials = "AD" }: UserIconProps) {
  return (
    // affiche les initiales
    <Link
      className="inline-flex h-[65px] w-[65px] items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-sm font-normal leading-none text-[var(--color-ink)] no-underline hover:bg-[var(--color-brand-soft-hover)]"
      href="/main/account"
      aria-label="profil utilisateur"
    >
      {initials}
    </Link>
  );
}