"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useResourcesMotion } from "./resources-motion-context";
import styles from "./resources-morph-backdrop.module.css";

const shapes = [
  { kind: "circle", x: [0, -20, -420, 360, 130, -200], y: [0, -40, 220, -260, -60, -160], rotate: [0, 30, 160, -90, 25, 0], scale: [.38, .72, 1.55, 1.02, .74, .5] },
  { kind: "square", x: [0, 20, 480, -390, -100, 200], y: [0, 40, -180, 270, 80, -160], rotate: [0, -20, 145, -105, 35, 0], scale: [.34, .7, 1.45, .92, .7, .5] },
  { kind: "capsule", x: [0, 40, -520, 410, 120, 0], y: [0, -20, 300, -210, 45, 220], rotate: [0, 25, -130, 175, -20, 0], scale: [.3, .8, 1.55, 1.05, .76, .54] },
  { kind: "diamond", x: [0, -30, 330, -260, -40, -200], y: [0, 20, -360, 240, -30, -160], rotate: [0, 45, -155, 130, -30, 0], scale: [.32, .7, 1.35, .9, .68, .5] },
  { kind: "circle", x: [0, 15, -80, 520, 190, 0], y: [0, 20, -470, 180, 10, 220], rotate: [0, -30, 175, -120, 30, 0], scale: [.25, .58, 2.05, 1.35, .9, .58] },
  { kind: "square", x: [0, -50, 560, -330, 20, 200], y: [0, 20, 190, -330, 20, -160], rotate: [0, 35, -125, 155, -15, 0], scale: [.28, .65, 1.3, .86, .64, .48] },
] as const;

const sceneStops = [0, .2, .42, .62, .8, 1];
const rotationStops = [0, .22, .46, .66, .84, 1];
const scaleStops = [0, .24, .5, .7, .86, 1];

function useShapeValue(values: readonly number[], progress: MotionValue<number>, stops = sceneStops): MotionValue<number> {
  return useTransform(progress, stops, [...values]);
}

function MorphShape({ shape, progress, index, reduced }: { shape: (typeof shapes)[number]; progress: MotionValue<number>; index: number; reduced: boolean }) {
  const x = useShapeValue(shape.x, progress);
  const y = useShapeValue(shape.y, progress);
  const rotate = useShapeValue(shape.rotate, progress, rotationStops);
  const scale = useShapeValue(shape.scale, progress, scaleStops);
  const opacity = useTransform(progress, [0, .2, .38, .52, .8, 1], [0, 0, .72, .88, .58, .18]);
  const style = reduced ? undefined : { x, y, rotate, scale, opacity };
  const common = { className: `${styles.fragment} ${styles[`fragment${index + 1}`]}`, style };

  if (shape.kind === "circle") return <motion.circle {...common} cx="500" cy="500" r="24" />;
  if (shape.kind === "square") return <motion.rect {...common} x="476" y="476" width="48" height="48" />;
  if (shape.kind === "capsule") return <motion.rect {...common} x="454" y="486" width="92" height="28" rx="14" />;
  return <motion.rect {...common} x="475" y="475" width="50" height="50" rx="4" transform="rotate(45 500 500)" />;
}

export function ResourcesMorphBackdrop() {
  const reduced = useReducedMotion() === true;
  const { scrollYProgress } = useResourcesMotion();
  const rectX = useTransform(scrollYProgress, [0, .2, .42, .62, .8, 1], [-250, 70, 24, -30, -110, -180]);
  const rectY = useTransform(scrollYProgress, [0, .2, .42, .62, .8, 1], [140, -28, 14, 0, -58, -128]);
  const rectRotate = useTransform(scrollYProgress, [0, .22, .46, .66, .84, 1], [-15, 12, 58, 96, 32, 0]);
  const rectScale = useTransform(scrollYProgress, [0, .24, .5, .7, .86, 1], [.8, 1.14, 1.48, 1.1, 2.05, 3.8]);
  const rectRadius = useTransform(scrollYProgress, [0, .24, .5, .7, .86, 1], [0, 12, 150, 300, 500, 500]);
  const rectOpacity = useTransform(scrollYProgress, [0, .3, .5, .72, .9, 1], [.78, .7, .46, .2, .08, .03]);
  const wipeOpacity = useTransform(scrollYProgress, [.68, .78, .88, .96, 1], [0, .02, .18, .72, .94]);
  const ringOpacity = useTransform(scrollYProgress, [.18, .38, .54, .76, .92, 1], [0, .12, .58, .72, .34, .08]);
  const networkOpacity = useTransform(scrollYProgress, [.58, .68, .8, .9, 1], [0, .04, .5, .82, .5]);
  const lineOffsetA = useTransform(scrollYProgress, [.58, .68, .8, 1], [320, 190, 0, 0]);
  const lineOffsetB = useTransform(scrollYProgress, [.62, .72, .84, 1], [320, 220, 0, 0]);
  const lineOffsetC = useTransform(scrollYProgress, [.66, .76, .88, 1], [320, 250, 0, 0]);
  const coreScale = useTransform(scrollYProgress, [.38, .54, .7, .84, 1], [.15, 1.55, 1.3, .94, .72]);
  const coreOpacity = useTransform(scrollYProgress, [.34, .48, .7, .88, 1], [0, .54, .86, .66, .32]);

  return <svg className={styles.backdrop} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="resources-morph-blue" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#4A70CC" stopOpacity=".22" />
        <stop offset="1" stopColor="#4A70CC" stopOpacity=".72" />
      </linearGradient>
      <radialGradient id="resources-morph-glow">
        <stop offset="0" stopColor="#4A70CC" stopOpacity=".32" />
        <stop offset="1" stopColor="#4A70CC" stopOpacity="0" />
      </radialGradient>
    </defs>
    <motion.g className={styles.heroForm} style={reduced ? undefined : { x: rectX, y: rectY, rotate: rectRotate, scale: rectScale, opacity: rectOpacity }}>
      <motion.rect x="50" y="170" width="900" height="660" rx={reduced ? 0 : rectRadius} fill="url(#resources-morph-blue)" />
      <motion.rect x="50" y="170" width="900" height="660" rx={reduced ? 0 : rectRadius} className={styles.heroOutline} />
    </motion.g>
    <motion.g className={styles.wipe} style={reduced ? undefined : { x: rectX, y: rectY, rotate: rectRotate, scale: rectScale, opacity: wipeOpacity }}>
      <motion.rect x="50" y="170" width="900" height="660" rx={reduced ? 0 : rectRadius} fill="#090B0D" />
    </motion.g>
    <motion.circle className={styles.ring} cx="500" cy="500" r="360" style={reduced ? undefined : { opacity: ringOpacity, scale: coreScale }} />
    <motion.circle className={styles.coreGlow} cx="500" cy="500" r="190" style={reduced ? undefined : { opacity: coreOpacity, scale: coreScale }} />
    <g className={styles.fragments}>
      {shapes.map((shape, index) => <MorphShape key={`${shape.kind}-${index}`} shape={shape} progress={scrollYProgress} index={index} reduced={reduced} />)}
    </g>
    <motion.g className={styles.network} style={reduced ? undefined : { opacity: networkOpacity }}>
      <motion.line x1="500" y1="500" x2="300" y2="340" strokeDasharray="320" style={reduced ? undefined : { strokeDashoffset: lineOffsetA }} />
      <motion.line x1="500" y1="500" x2="700" y2="340" strokeDasharray="320" style={reduced ? undefined : { strokeDashoffset: lineOffsetB }} />
      <motion.line x1="500" y1="500" x2="500" y2="720" strokeDasharray="320" style={reduced ? undefined : { strokeDashoffset: lineOffsetC }} />
      <motion.line x1="300" y1="340" x2="700" y2="340" strokeDasharray="320" style={reduced ? undefined : { strokeDashoffset: lineOffsetC }} />
      <circle cx="300" cy="340" r="18" />
      <rect x="682" y="322" width="36" height="36" rx="6" />
      <circle cx="500" cy="720" r="20" />
    </motion.g>
  </svg>;
}
