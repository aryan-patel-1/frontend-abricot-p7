import Image from "next/image";

import styles from "../css/footer.module.css";

export default function Footer() {
  return (
    // affiche le bas de page
    <footer className={styles.footer}>
      <Image
        src="/img/logo-noir.svg"
        alt="Abricot"
        width={253}
        height={33}
        className={styles.logo}
      />
      <span className={styles.text}>Abricot 2025</span>
    </footer>
  );
}