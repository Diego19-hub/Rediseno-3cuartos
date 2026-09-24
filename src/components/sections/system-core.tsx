"use client";

import { motion, useReducedMotion } from "framer-motion";
import styles from "./system-core.module.css";

export function SystemCore() {
  const reducedMotion = useReducedMotion();
  return <motion.figure className={styles.core} initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: reducedMotion ? 0 : 0.6, ease: "easeOut" }}>
    <div className={styles.sculpture} aria-hidden="true">
      <span className={`${styles.fragment} ${styles.strategy}`} />
      <span className={`${styles.fragment} ${styles.creativity}`} />
      <span className={`${styles.fragment} ${styles.technology}`}><i /><i /><i /></span>
    </div>
    <figcaption className={styles.legend}>
      <span>Estrategia</span>
      <span>Creatividad</span>
      <span>Tecnología</span>
    </figcaption>
  </motion.figure>;
}
