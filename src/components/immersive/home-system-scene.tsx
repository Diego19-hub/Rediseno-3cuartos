"use client";

import Link from "next/link";
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { ScrollTimeline } from "@/components/motion/scroll-timeline";
import { SystemCore } from "@/components/sections/system-core";
import styles from "./home-system-scene.module.css";

export function HomeSystemScene() {
  const reduced = useReducedMotion() === true;

  return <ScrollTimeline className={styles.scene}>{(progress) => <SceneComposition progress={progress} reduced={reduced} />}</ScrollTimeline>;
}

function SceneComposition({ progress, reduced }: { progress: MotionValue<number>; reduced: boolean }) {
  const firstLineX = useTransform(progress, [0, 0.3, 0.72, 1], ["0vw", "0vw", "-28vw", "-40vw"]);
  const secondLineX = useTransform(progress, [0, 0.3, 0.72, 1], ["0vw", "0vw", "28vw", "40vw"]);
  const titleOpacity = useTransform(progress, [0, 0.62, 0.92], [1, 1, 0.12]);
  const copyY = useTransform(progress, [0, 0.42, 1], ["0vh", "0vh", "-12vh"]);
  const copyOpacity = useTransform(progress, [0, 0.64, 1], [1, 1, 0]);
  const coreScale = useTransform(progress, [0, 0.28, 0.72, 1], [0.62, 0.62, 1, 1.08]);
  const coreOpacity = useTransform(progress, [0, 0.2, 0.62, 1], [0.08, 0.24, 1, 1]);
  const coreX = useTransform(progress, [0, 0.52, 1], ["18vw", "6vw", "0vw"]);

  return <div className={styles.sticky}>
    <motion.div className={styles.copy} style={reduced ? undefined : { opacity: titleOpacity }}>
      <p className={styles.eyebrow}>Un sistema, múltiples capacidades.</p>
      <h2 aria-label="Tres disciplinas. Una misma dirección.">
        <motion.span style={reduced ? undefined : { x: firstLineX }}>Tres disciplinas.</motion.span>
        <motion.span style={reduced ? undefined : { x: secondLineX }}>Una misma dirección.</motion.span>
      </h2>
      <motion.div style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}>
        <p>Conectamos marca, producto y crecimiento para construir experiencias que funcionan como un solo sistema.</p>
        <Link href="/servicios">Explorar nuestros servicios <span aria-hidden="true">→</span></Link>
      </motion.div>
    </motion.div>
    <motion.div className={styles.core} style={reduced ? undefined : { x: coreX, scale: coreScale, opacity: coreOpacity }}><SystemCore /></motion.div>
  </div>;
}
