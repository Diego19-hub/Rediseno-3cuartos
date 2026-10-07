import styles from "./primitives.module.css";

/** Internal design-system fixture; never used by production routes. */
export function ProvisionalBadge() {
  return <span className={styles.badge}>Provisional — cliente</span>;
}
