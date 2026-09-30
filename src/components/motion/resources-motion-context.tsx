"use client";

import { useScroll, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type ResourcesMotionValue = {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
};

const ResourcesMotionContext = createContext<ResourcesMotionValue | null>(null);

export function ResourcesMotionProvider({ children }: { children: ReactNode }) {
  const { scrollY, scrollYProgress } = useScroll();
  return <ResourcesMotionContext.Provider value={{ scrollY, scrollYProgress }}>{children}</ResourcesMotionContext.Provider>;
}

export function useResourcesMotion() {
  const context = useContext(ResourcesMotionContext);
  if (!context) throw new Error("useResourcesMotion must be used inside ResourcesMotionProvider");
  return context;
}
