import NextLink from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
};

// réutilise le routage Next.js avec le style des liens secondaires
export default function AppLink({
  className = "",
  children,
  href,
  ...props
}: AppLinkProps) {
  return (
    <NextLink
      className={`text-sm font-normal leading-[1.2] text-[var(--color-brand)] underline underline-offset-2 hover:text-[var(--color-brand-hover)] ${className}`}
      href={href}
      {...props}
    >
      {children}
    </NextLink>
  );
}
