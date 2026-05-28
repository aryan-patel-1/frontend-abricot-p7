import NextLink from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
};

export default function AppLink({
  className = "",
  children,
  href,
  ...props
}: AppLinkProps) {
  return (
    // affiche un lien
    <NextLink
      className={`text-sm font-normal leading-[1.2] text-[#d3590b] underline underline-offset-2 hover:text-[#a94308] ${className}`}
      href={href}
      {...props}
    >
      {children}
    </NextLink>
  );
}
