"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useIsMobileEditorialViewport } from "@/components/motion/use-mobile-editorial-scroll";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  direction?: "x" | "y";
  scale?: number;
  mobileTranslationDistance?: number;
  mobileSettleAt?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 28,
  direction = "y",
  scale = 0.985,
  mobileTranslationDistance,
  mobileSettleAt = 0.24,
}: ScrollRevealProps) {
  const reduced = useReducedMotion() === true;
  const isMobile = useIsMobileEditorialViewport();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.94", "end 0.18"] });
  const offset = useTransform(scrollYProgress, [0, 0.35, 1], [direction === "x" ? -distance : distance, 0, -distance * 0.18]);
  const mobileOffset = useTransform(scrollYProgress, [0, mobileSettleAt, 1], [direction === "x" ? -(mobileTranslationDistance ?? 0) : (mobileTranslationDistance ?? 0), 0, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.88, 1], [0.18, 1, 1, 0.72]);
  const scaleValue = useTransform(scrollYProgress, [0, 0.35, 1], [scale, 1, 1]);
  const activeOffset = isMobile && mobileTranslationDistance !== undefined ? mobileOffset : offset;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      style={reduced ? undefined : { opacity, scale: scaleValue, ...(direction === "x" ? { x: activeOffset } : { y: activeOffset }) }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
