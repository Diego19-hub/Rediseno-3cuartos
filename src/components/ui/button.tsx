import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; href?: string; variant?: "primary" | "secondary" };

export function Button({ children, className, href, variant = "primary", ...props }: ButtonProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");
  if (href) return <Link className={classes} href={href}>{children}</Link>;
  return <button className={classes} type="button" {...props}>{children}</button>;
}
