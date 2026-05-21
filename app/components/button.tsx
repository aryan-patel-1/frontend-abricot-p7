import type { ButtonHTMLAttributes } from "react";

import styles from "../css/button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    // affiche un bouton
    <button className={`${styles.button} ${className}`} {...props}>
      {children}
    </button>
  );
}