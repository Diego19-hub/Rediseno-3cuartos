"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./pinned-section.module.css";

type PinnedSectionProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  height?: number;
};

/** Structural primitive for scenes whose composition stays visible while scroll advances. */
export function PinnedSection({ children, className, contentClassName, height = 180 }: PinnedSectionProps) {
  const style = { "--motion-scene-height": `${height}svh` } as CSSProperties;
  return <div className={`${styles.scene} ${className ?? ""}`} style={style}><div className={`${styles.sticky} ${contentClassName ?? ""}`}>{children}</div></div>;
}

