import Image from "next/image";

import styles from "../css/logo.module.css";

type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    // affiche le logo
    <Image
      src="/img/logo-orange.svg"
      alt="Abricot"
      width={253}
      height={33}
      className={`${styles.logo} ${className}`}
      priority
    />
  );
}