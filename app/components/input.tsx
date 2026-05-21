import type { InputHTMLAttributes } from "react";

import styles from "../css/input.module.css";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function TextInput({
  id,
  label,
  className = "",
  ...props
}: TextInputProps) {
  return (
    // affiche un champ
    <label className={`${styles.field} ${className}`} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <input id={id} className={styles.input} {...props} />
    </label>
  );
}