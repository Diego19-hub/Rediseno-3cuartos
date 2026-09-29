"use client";

import { motion, useReducedMotion, useScroll, useTransform, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type EditorialScrollSceneProps = Omit<HTMLMotionProps<"section">, "children" | "className" | "style"> & {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
  intensity?: "quiet" | "medium" | "strong";
};

/** A reversible editorial scene transition for pages that need compositional movement without pinning. */
export function EditorialScrollScene({ children, className, direction = "right", intensity = "quiet", ...sectionProps }: EditorialScrollSceneProps) {
  const reduced = useReducedMotion() === true;
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);

    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);

    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.94", "end 0.16"] });
  const distance = isMobile ? 3 : intensity === "strong" ? 36 : intensity === "medium" ? 20 : 8;
  const startX = direction === "left" ? `-${distance}vw` : `${distance}vw`;
  const endX = direction === "left" ? `${distance * 0.45}vw` : `-${distance * 0.45}vw`;
  const x = useTransform(scrollYProgress, [0, 0.24, 0.72, 1], [startX, "0vw", "0vw", endX]);
  const y = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [isMobile ? "2vh" : "5vh", "0vh", "0vh", isMobile ? "-1vh" : "-4vh"]);
  const scale = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [isMobile ? 0.98 : intensity === "strong" ? 0.82 : intensity === "medium" ? 0.9 : 0.94, 1, 1, isMobile ? 0.99 : intensity === "strong" ? 0.9 : intensity === "medium" ? 0.94 : 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.82, 1], [isMobile ? 0.58 : 0.3, 1, 1, 1]);

  return <motion.section ref={ref} className={className} style={reduced ? undefined : { x, y, scale, opacity }} {...sectionProps}>{children}</motion.section>;
}
