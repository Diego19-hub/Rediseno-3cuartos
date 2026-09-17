import styles from "./primitives.module.css";
export function MediaPlaceholder({ label = "Media provisional" }: { label?: string }) { return <div aria-label={label} className={styles.media} role="img"><span>{label}</span></div>; }
