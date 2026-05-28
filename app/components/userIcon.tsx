import Link from "next/link";

type UserIconProps = {
  initials?: string;
};

export default function UserIcon({ initials = "AD" }: UserIconProps) {
  return (
    // affiche les initiales
    <Link
      className="inline-flex h-[65px] w-[65px] items-center justify-center rounded-full bg-[#fde3d3] text-sm font-normal leading-none text-[#111111] no-underline hover:bg-[#f8d4bd]"
      href="/main/account"
      aria-label="profil utilisateur"
    >
      {initials}
    </Link>
  );
}