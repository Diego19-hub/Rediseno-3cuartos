"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ScrollSplitHeadingProps = {
  children: string;
  id?: string;
  className?: string;
};

export function ScrollSplitHeading({ children, id, className }: ScrollSplitHeadingProps) {
  const reduced = useReducedMotion() === true;
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.2"] });
  const words = children.trim().split(/\s+/);

  return (
    <motion.h2 ref={ref} id={id} className={className} aria-label={children}>
      <span aria-hidden="true">
        {words.map((word, index) => <SplitWord key={`${word}-${index}`} word={word} index={index} total={words.length} progress={scrollYProgress} reduced={reduced} />)}
      </span>
    </motion.h2>
  );
}

function SplitWord({ word, index, total, progress, reduced }: { word: string; index: number; total: number; progress: ReturnType<typeof useScroll>["scrollYProgress"]; reduced: boolean }) {
  const direction = index % 2 === 0 ? -1 : 1;
  const x = useTransform(progress, [0, 0.45, 1], [direction * 34, 0, direction * -8]);
  const opacity = useTransform(progress, [0, 0.3, 1], [0.25, 1, 0.92]);
  return <motion.span style={reduced ? { display: "inline-block" } : { display: "inline-block", x, opacity }}>{word}{index < total - 1 ? " " : ""}</motion.span>;
}
