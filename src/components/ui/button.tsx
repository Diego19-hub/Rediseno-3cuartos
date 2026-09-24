import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; href?: string; variant?: "primary" | "secondary" };

export function Button({ children, className, href, variant = "primary", disabled, target, rel, ...props }: ButtonProps & { target?: string; rel?: string }) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");
  if (href) return <Link className={classes} href={href} target={target} rel={rel}>{children}</Link>;
  return <button className={classes} type="button" disabled={disabled} {...props}>{children}</button>;
}
