"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

type ParallaxLayerProps = {
  children: ReactNode;
  className?: string;
  amount?: number;
};

export function ParallaxLayer({ children, className, amount = 18 }: ParallaxLayerProps) {
  const reduced = useReducedMotion() === true;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return <motion.div ref={ref} className={className} style={reduced ? undefined : { y }}>{children}</motion.div>;
}

