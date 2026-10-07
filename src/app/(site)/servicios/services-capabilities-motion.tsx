"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import styles from "./page.module.css";

type Discipline = {
  index: string;
  slug: string;
  name: string;
  href?: string;
  capabilities: readonly string[];
};

export function ServicesCapabilitiesMotion({ disciplines }: { disciplines: readonly Discipline[] }) {
  const reduced = useReducedMotion() === true;
  const headingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: headingProgress } = useScroll({ target: headingRef, offset: ["start 0.85", "end 0.25"] });
  const headingY = useTransform(headingProgress, [0, 1], [60, -20]);
  const headingOpacity = useTransform(headingProgress, [0, 1], [0.75, 1]);

  return <section data-header-theme="light" className={styles.matrix} aria-labelledby="matrix-title">
    <motion.div ref={headingRef} className={styles.matrixHeader} style={reduced ? undefined : { y: headingY, opacity: headingOpacity }}>
      <h1 className={styles.matrixTitle} id="matrix-title">Capacidades</h1>
    </motion.div>
    <div className={styles.disciplineList}>
      {disciplines.map((discipline) => <DisciplineRow discipline={discipline} key={discipline.index} />)}
    </div>
  </section>;
}

function DisciplineRow({ discipline }: { discipline: Discipline }) {
  const reduced = useReducedMotion() === true;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.25"] });
  const isBranding = discipline.slug === "diseno-branding";
  const isWeb = discipline.slug === "desarrollo-web";
  const titleX = useTransform(scrollYProgress, [0, 1], isBranding ? [25, -15] : [-25, 15]);
  const capabilityX = useTransform(scrollYProgress, [0, 1], isBranding ? [-35, 10] : [35, -10]);
  const capabilityY = useTransform(scrollYProgress, [0, 1], isWeb ? [15, -10] : [0, 0]);
  const dividerScale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return <motion.article ref={ref} className={styles.discipline}>
    <motion.div className={styles.disciplineTitle} style={reduced ? undefined : { x: titleX }}>
      <span>{discipline.index}</span>
      <h3>{discipline.name}</h3>
      {discipline.href ? <Link href={discipline.href} aria-label={`Explorar ${discipline.name}`}>Explorar <span aria-hidden="true">→</span></Link> : null}
    </motion.div>
    <motion.ul style={reduced ? undefined : { x: capabilityX, y: capabilityY }}>
      {discipline.capabilities.map((capability, index) => <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span>{capability}</li>)}
    </motion.ul>
    <motion.span className={styles.disciplineDivider} aria-hidden="true" style={reduced ? undefined : { scaleX: dividerScale }} />
  </motion.article>;
}
