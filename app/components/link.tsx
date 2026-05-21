import NextLink from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import styles from "../css/link.module.css";

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
    <NextLink className={`${styles.link} ${className}`} href={href} {...props}>
      {children}
    </NextLink>
  );
}