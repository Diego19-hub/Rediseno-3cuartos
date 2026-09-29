"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { PinnedSection } from "@/components/motion/pinned-section";
import { ScrollTimeline } from "@/components/motion/scroll-timeline";
import styles from "./about-process-scene.module.css";

type ProcessSceneProps = {
  stages: readonly { title: string; copy: string }[];
};

export function AboutProcessScene({ stages }: ProcessSceneProps) {
  const reduced = useReducedMotion() === true;

  if (reduced) return <StaticProcess stages={stages} />;

  return <ScrollTimeline className={styles.timeline}>{(progress) => <PinnedSection className={styles.pinned} contentClassName={styles.stage} height={480}>
    <div className={styles.intro}><p>Una secuencia adaptable</p><h2>Primero entendemos. Después construimos contigo.</h2></div>
    {stages.map((stage, index) => <ProcessMoment key={stage.title} stage={stage} index={index} progress={progress} total={stages.length} />)}
    <span className={styles.progressLine} aria-hidden="true" />
  </PinnedSection>}</ScrollTimeline>;
}

function ProcessMoment({ stage, index, progress, total }: { stage: ProcessSceneProps["stages"][number]; index: number; progress: MotionValue<number>; total: number }) {
  const focus = total === 1 ? 0.08 : 0.08 + (index / (total - 1)) * 0.84;
  const enterStart = Math.max(0, focus - 0.16);
  const holdEnd = Math.min(1, focus + 0.1);
  const exitEnd = Math.min(1, focus + 0.22);
  const direction = index % 2 === 0 ? -1 : 1;
  const isLast = index === total - 1;
  const x = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [`${direction * 28}vw`, "0vw", "0vw", isLast ? "0vw" : `${direction * -24}vw`]);
  const y = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], ["20vh", "0vh", "0vh", isLast ? "0vh" : "-12vh"]);
  const scale = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [0.76, 1, 1, isLast ? 1 : 0.82]);
  const opacity = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [0.02, 1, 1, isLast ? 1 : 0.08]);
  const titleX = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [`${direction * 12}vw`, "0vw", "0vw", isLast ? "0vw" : `${direction * -14}vw`]);
  const titleScale = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [0.72, 1, 1, isLast ? 1 : 0.84]);

  return <motion.article className={styles.moment} style={{ x, y, scale, opacity, zIndex: index + 1 }}>
    <span className={styles.index}>0{index + 1}</span>
    <motion.h3 style={{ x: titleX, scale: titleScale }}>{stage.title}</motion.h3>
    <p>{stage.copy}</p>
    <span className={styles.rule} aria-hidden="true" />
  </motion.article>;
}

function StaticProcess({ stages }: ProcessSceneProps) {
  return <section className={styles.staticProcess} aria-labelledby="process-title"><p>Una secuencia adaptable</p><h2 id="process-title">Primero entendemos. Después construimos contigo.</h2><ol>{stages.map((stage, index) => <li key={stage.title}><span>0{index + 1}</span><div><h3>{stage.title}</h3><p>{stage.copy}</p></div></li>)}</ol></section>;
}
