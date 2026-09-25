"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import styles from "./system-core.module.css";

export function SystemCore() {
  const reducedMotion = useReducedMotion();
  const coreRef = useRef<HTMLElement>(null);
  const [motionState, setMotionState] = useState<"separated" | "assembled" | "expanded">("separated");
  const { scrollYProgress } = useScroll({ target: coreRef, offset: ["start end", "end start"] });
  const strategyX = useTransform(scrollYProgress, [0, 0.32, 0.66, 1], [-42, 0, -14, -76]);
  const strategyY = useTransform(scrollYProgress, [0, 0.32, 0.66, 1], [34, 0, 0, -26]);
  const strategyRotate = useTransform(scrollYProgress, [0, 0.32, 0.66, 1], [-18, -9, -12, -24]);
  const creativityX = useTransform(scrollYProgress, [0, 0.32, 0.66, 1], [42, 0, 16, 58]);
  const creativityY = useTransform(scrollYProgress, [0, 0.32, 0.66, 1], [24, 0, 0, -14]);
  const creativityRotate = useTransform(scrollYProgress, [0, 0.32, 0.66, 1], [18, 10, 14, 25]);
  const technologyX = useTransform(scrollYProgress, [0, 0.32, 0.66, 1], [18, 0, 12, 30]);
  const technologyY = useTransform(scrollYProgress, [0, 0.32, 0.66, 1], [48, 0, 0, 32]);
  const technologyRotate = useTransform(scrollYProgress, [0, 0.32, 0.66, 1], [12, 4, 8, 17]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextState = progress < 0.32 ? "separated" : progress < 0.66 ? "assembled" : "expanded";
    setMotionState((current) => current === nextState ? current : nextState);
  });

  return <motion.figure ref={coreRef} data-motion-state={motionState} className={styles.core} initial={reducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: reducedMotion ? 0 : 0.6, ease: "easeOut" }}>
    <div className={styles.sculpture} aria-hidden="true">
      <motion.span className={`${styles.fragment} ${styles.strategy}`} style={reducedMotion ? undefined : { x: strategyX, y: strategyY, rotate: strategyRotate }} />
      <motion.span className={`${styles.fragment} ${styles.creativity}`} style={reducedMotion ? undefined : { x: creativityX, y: creativityY, rotate: creativityRotate }} />
      <motion.span className={`${styles.fragment} ${styles.technology}`} style={reducedMotion ? undefined : { x: technologyX, y: technologyY, rotate: technologyRotate }}><i /><i /><i /></motion.span>
    </div>
    <figcaption className={styles.legend}>
      <span>Estrategia</span>
      <span>Creatividad</span>
      <span>Tecnología</span>
    </figcaption>
  </motion.figure>;
}
