"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import styles from "./system-core.module.css";

export function SystemCore() {
  const reducedMotion = useReducedMotion();
  const coreRef = useRef<HTMLElement>(null);

  return <motion.figure ref={coreRef} className={styles.core} initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: reducedMotion ? 0 : 0.6, ease: "easeOut" }}>
    <div className={styles.sculpture} aria-hidden="true">
      <motion.span className={`${styles.fragment} ${styles.strategy}`} animate={reducedMotion ? undefined : { x: [-18, 0, -22, 0, -18], y: [26, 0, -14, 0, 26], rotate: [-15, -8, -17, -8, -15], scale: [.96, 1, .97, 1, .96] }} transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.span className={`${styles.fragment} ${styles.creativity}`} animate={reducedMotion ? undefined : { x: [22, 0, 20, 0, 22], y: [18, 0, -10, 0, 18], rotate: [15, 9, 18, 9, 15], scale: [.96, 1, .98, 1, .96] }} transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: -1.6 }} />
      <motion.span className={`${styles.fragment} ${styles.technology}`} animate={reducedMotion ? undefined : { x: [14, 0, 16, 0, 14], y: [28, 0, 12, 0, 28], rotate: [10, 4, 13, 4, 10], scale: [.97, 1, .98, 1, .97] }} transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut", delay: -3 }}><i /><i /><i /></motion.span>
    </div>
    <figcaption className={styles.legend}>
      <span>Branding</span>
      <span>Marketing</span>
      <span>Desarrollo web</span>
    </figcaption>
  </motion.figure>;
}
