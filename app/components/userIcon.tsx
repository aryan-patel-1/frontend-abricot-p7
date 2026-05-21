import Link from "next/link";

import styles from "../css/userIcon.module.css";

type UserIconProps = {
  initials?: string;
};

export default function UserIcon({ initials = "AD" }: UserIconProps) {
  return (
    // affiche les initiales
    <Link className={styles.userIcon} href="/account" aria-label="profil utilisateur">
      {initials}
    </Link>
  );
}