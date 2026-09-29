"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  direction?: "x" | "y";
  scale?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 28,
  direction = "y",
  scale = 0.985,
}: ScrollRevealProps) {
  const reduced = useReducedMotion() === true;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.94", "end 0.18"] });
  const offset = useTransform(scrollYProgress, [0, 0.35, 1], [direction === "x" ? -distance : distance, 0, -distance * 0.18]);
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.88, 1], [0.18, 1, 1, 0.72]);
  const scaleValue = useTransform(scrollYProgress, [0, 0.35, 1], [scale, 1, 1]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      style={reduced ? undefined : { opacity, scale: scaleValue, ...(direction === "x" ? { x: offset } : { y: offset }) }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

