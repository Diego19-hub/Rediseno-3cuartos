"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import styles from "./about-manifesto-scene.module.css";

type ManifestoSceneProps = {
  capabilities: Array<{ discipline: string; capability: string; href: string }>;
};

type ManifestoMoment = {
  marker: string;
  label?: string;
  title: string;
  copy: string;
  dark?: boolean;
};

const moments: ManifestoMoment[] = [
  {
    marker: "01 / QUIÉNES SOMOS",
    label: "3Cuartos",
    title: "Ideas, sistemas y experiencias con una dirección común.",
    copy: "Desarrollamos soluciones y activos digitales orientados a objetivos empresariales, conectando estrategia, creatividad y tecnología.",
  },
  {
    marker: "02 / NUESTRA FORMA DE PENSAR",
    title: "Tres capacidades que trabajan como un sistema.",
    copy: "Cada proyecto puede necesitar una combinación distinta. La dirección compartida mantiene conectadas las decisiones.",
  },
];

export function AboutManifestoScene({ capabilities }: ManifestoSceneProps) {
  return <div className={styles.staticStack}>{moments.map((moment, index) => <ManifestoMoment key={moment.marker} moment={moment} capabilities={index === 2 ? capabilities : undefined} index={index} />)}</div>;
}

function ManifestoMoment({ moment, capabilities, index }: { moment: ManifestoMoment; capabilities?: ManifestoSceneProps["capabilities"]; index: number }) {
  const reduced = useReducedMotion() === true;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.25"] });
  const second = index === 1;
  const markerX = useTransform(scrollYProgress, [0, 1], second ? [20, -10] : [-20, 10]);
  const markerY = useTransform(scrollYProgress, [0, 1], second ? [35, -15] : [0, 0]);
  const titleX = useTransform(scrollYProgress, [0, 1], second ? [45, -15] : [-40, 15]);
  const titleY = useTransform(scrollYProgress, [0, 1], second ? [35, -15] : [30, -10]);
  const copyX = useTransform(scrollYProgress, [0, 1], second ? [20, -5] : [-15, 5]);
  const copyY = useTransform(scrollYProgress, [0, 1], second ? [25, -10] : [20, -5]);
  const ruleScale = useTransform(scrollYProgress, [0, 1], second ? [0.25, 1] : [0.35, 1]);
  const ruleY = useTransform(scrollYProgress, [0, 1], [second ? 18 : 0, second ? -8 : 0]);

  return <article ref={ref} className={`${styles.moment} ${moment.dark ? styles.dark : ""}`}>
    <motion.div className={styles.marker} style={reduced ? undefined : { x: markerX, y: markerY }}>
      <span>{moment.marker}</span>{moment.label && <span>{moment.label}</span>}
    </motion.div>
    <motion.h2 style={reduced ? undefined : { x: titleX, y: titleY }}>{moment.title}</motion.h2>
    <motion.p className={styles.copy} style={reduced ? undefined : { x: copyX, y: copyY }}>{moment.copy}</motion.p>
    {capabilities ? <div className={styles.capabilities}>{capabilities.map((item, itemIndex) => <Link href={item.href} key={item.href}><span>0{itemIndex + 1}</span><strong>{item.discipline}</strong><small>{item.capability}</small><b aria-hidden="true">↗</b></Link>)}</div> : <motion.span className={styles.rule} aria-hidden="true" style={reduced ? undefined : { scaleX: ruleScale, y: ruleY }} />}
  </article>;
}
