"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { PinnedSection } from "@/components/motion/pinned-section";
import { ScrollTimeline } from "@/components/motion/scroll-timeline";
import styles from "./services-discipline-timeline.module.css";

export type DisciplineMoment = {
  index: string;
  label: string;
  title: string;
  copy: string;
};

type ServicesDisciplineTimelineProps = {
  disciplines: readonly DisciplineMoment[];
  staticMode: boolean;
};

export function ServicesDisciplineTimeline({ disciplines, staticMode }: ServicesDisciplineTimelineProps) {
  if (staticMode) {
    return <div className={styles.staticStack}>{disciplines.map((discipline) => <DisciplineContent key={discipline.index} discipline={discipline} />)}</div>;
  }

  return <ScrollTimeline className={styles.timeline}>{(progress) => <PinnedSection className={styles.pinned} contentClassName={styles.stage} height={315}>
    <p className={styles.kicker}>Disciplinas conectadas</p>
    {disciplines.map((discipline, index) => <DisciplineMomentCard key={discipline.index} discipline={discipline} index={index} progress={progress} />)}
    <span className={styles.progressLine} aria-hidden="true" />
  </PinnedSection>}</ScrollTimeline>;
}

function DisciplineMomentCard({ discipline, index, progress }: { discipline: DisciplineMoment; index: number; progress: MotionValue<number> }) {
  const focusPoints = [0.08, 0.5, 0.88] as const;
  const focus = focusPoints[index] ?? 0.88;
  const start = Math.max(0, focus - 0.18);
  const holdEnd = Math.min(1, focus + 0.12);
  const end = Math.min(1, focus + 0.3);
  const direction = index % 2 === 0 ? -1 : 1;
  const isLast = index === 2;
  const x = useTransform(progress, [start, focus, holdEnd, end], [`${direction * 24}vw`, "0vw", "0vw", isLast ? "0vw" : `${direction * -18}vw`]);
  const y = useTransform(progress, [start, focus, holdEnd, end], ["18vh", "0vh", "0vh", isLast ? "0vh" : "-12vh"]);
  const scale = useTransform(progress, [start, focus, holdEnd, end], [0.78, 1, 1, isLast ? 1 : 0.86]);
  const opacity = useTransform(progress, [start, focus, holdEnd, end], [0.08, 1, 1, isLast ? 1 : 0.2]);
  const titleX = useTransform(progress, [start, focus, holdEnd, end], [`${direction * 12}vw`, "0vw", "0vw", isLast ? "0vw" : `${direction * -10}vw`]);
  const titleY = useTransform(progress, [start, focus, holdEnd, end], ["6vh", "0vh", "0vh", isLast ? "0vh" : "-5vh"]);
  const titleScale = useTransform(progress, [start, focus, holdEnd, end], [0.86, 1, 1, isLast ? 1 : 0.9]);
  const titleRotate = useTransform(progress, [start, focus, holdEnd, end], [direction * -2.5, 0, 0, isLast ? 0 : direction * 2]);

  return <motion.article className={styles.moment} style={{ x, y, scale, opacity, zIndex: index + 1 }}><DisciplineContent discipline={discipline} titleStyle={{ x: titleX, y: titleY, scale: titleScale, rotate: titleRotate }} /></motion.article>;
}

function DisciplineContent({ discipline, titleStyle }: { discipline: DisciplineMoment; titleStyle?: { x: MotionValue<string>; y: MotionValue<string>; scale: MotionValue<number>; rotate: MotionValue<number> } }) {
  return <>
    <div className={styles.heading}><span className={styles.index} aria-hidden="true">{discipline.index}</span><p>{discipline.label}</p></div>
    <motion.h2 style={titleStyle}>{discipline.title}</motion.h2>
    <p className={styles.copy}>{discipline.copy}</p>
    <span className={styles.rule} aria-hidden="true" />
  </>;
}
