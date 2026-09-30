"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { useResourcesMotion } from "./resources-motion-context";
import styles from "./resources-text-highlight.module.css";

type ResourcesTextHighlightProps = {
  children: ReactNode;
  className?: string;
  emphasis?: "blue" | "light";
  phase?: readonly [number, number];
  strength?: "subtle" | "strong" | "refined";
};

export function ResourcesTextHighlight({ children, className, emphasis = "blue", phase = [0.18, 0.82], strength = "subtle" }: ResourcesTextHighlightProps) {
  const reduced = useReducedMotion() === true;
  const targetRef = useRef<HTMLSpanElement>(null);
  const { scrollY } = useResourcesMotion();
  const [bounds, setBounds] = useState({ top: 0, height: 1 });
  const [viewportHeight, setViewportHeight] = useState(0);

  useLayoutEffect(() => {
    const element = targetRef.current;
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      setViewportHeight(window.innerHeight);
      setBounds({ top: rect.top + window.scrollY, height: Math.max(rect.height, 1) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const sceneProgress = useTransform(scrollY, (value) => {
    if (viewportHeight <= 0) return 0;
    const start = bounds.top - viewportHeight * 0.86;
    const end = bounds.top + bounds.height - viewportHeight * 0.38;
    return Math.max(0, Math.min(1, (value - start) / Math.max(end - start, 1)));
  });
  const [phaseStart, phaseEnd] = phase;
  const phaseLength = Math.max(phaseEnd - phaseStart, 0.1);
  const progress = useTransform(sceneProgress, [phaseStart, phaseStart + phaseLength * 0.22, phaseStart + phaseLength * 0.78, phaseEnd], [0, 1, 1, 0]);
  const clipPath = useTransform(progress, [0, 1], ["inset(0 100% 0 -0.08em)", "inset(0 -0.08em 0 -0.08em)"]);
  const shadow = useTransform(progress, [0, 0.35, 0.72, 1], ["0 0 0 rgba(74,112,204,0)", "0 0 18px rgba(74,112,204,0.12)", "0 0 18px rgba(74,112,204,0.12)", "0 0 0 rgba(74,112,204,0)"]);
  const accentColor = emphasis === "light" ? "#F2F2EE" : "#4A70CC";

  return <motion.span ref={targetRef} className={`${styles.highlight} ${styles[strength]} ${className ?? ""}`} style={reduced ? undefined : { textShadow: shadow }}>
    {!reduced ? <motion.span className={styles.band} aria-hidden="true" style={{ scaleX: progress, opacity: progress }} /> : null}
    {!reduced ? <motion.span className={styles.accentMask} aria-hidden="true" style={{ clipPath }}><span className={styles.accent} style={{ color: accentColor }}>{children}</span></motion.span> : null}
    <span className={styles.content}>{children}</span>
  </motion.span>;
}
