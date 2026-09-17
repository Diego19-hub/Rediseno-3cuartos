import type { InputHTMLAttributes } from "react";
import styles from "./primitives.module.css";
type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; helpText?: string };
export function FormField({ id, label, error, helpText, ...props }: Props) { const helpId=helpText?`${id}-help`:undefined; const errorId = error ? `${id}-error` : undefined; const describedBy=[helpId,errorId].filter(Boolean).join(" ")||undefined; return <label className={styles.field} htmlFor={id}><span>{label}</span><input aria-describedby={describedBy} aria-invalid={Boolean(error)} id={id} {...props} />{helpText && <span id={helpId}>{helpText}</span>}{error && <span className={styles.error} id={errorId}>{error}</span>}</label>; }
