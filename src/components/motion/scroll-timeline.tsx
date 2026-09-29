"use client";

import { useScroll, type MotionValue, type UseScrollOptions } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

type ScrollTimelineProps = {
  children: (progress: MotionValue<number>) => ReactNode;
  className?: string;
  offset?: UseScrollOptions["offset"];
};

/** A reversible scroll-scrub timeline scoped to one narrative scene. */
export function ScrollTimeline({ children, className, offset = ["start start", "end end"] }: ScrollTimelineProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });

  return <section ref={ref} className={className}>{children(scrollYProgress)}</section>;
}
