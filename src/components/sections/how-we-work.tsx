"use client";

import Link from "next/link";
import { motion, type MotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BRAND_MINERAL } from "@/lib/brand-colors";
import styles from "./how-we-work.module.css";

const messages = [
  {
    number: "01",
    text: "Trabajamos junto a tu equipo.",
    position: "messageOne",
  },
  {
    number: "02",
    text: "Entendemos tus metas.",
    position: "messageTwo",
  },
  {
    number: "03",
    text: "Diseñamos un plan personalizado.",
    position: "messageThree",
  },
] as const;

function WorkMessage({
  number,
  text,
  position,
  progress,
  reduced,
}: (typeof messages)[number] & { progress: MotionValue<number>; reduced: boolean }) {
  const ranges: Record<(typeof messages)[number]["position"], [number, number, number]> = {
    messageOne: [0, 0.18, 0.38],
    messageTwo: [0.25, 0.5, 0.68],
    messageThree: [0.55, 0.78, 1],
  } as const;
  const range = ranges[position];
  const opacity = useTransform(progress, range, [0.55, 1, 0.72]);
  const y = useTransform(progress, range, [18, 0, -8]);
  const color = useTransform(progress, range, ["#8f9697", BRAND_MINERAL, "#a5aaa8"]);

  return (
    <motion.article
      className={`${styles.message} ${styles[position]}`}
      style={reduced ? undefined : { opacity, y, color }}
    >
      <span className={styles.messageNumber}>{number}</span>
      <h3>{text}</h3>
    </motion.article>
  );
}

export function HowWeWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedPreference = useReducedMotion();
  const reduced = reducedPreference === true;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineProgress = useTransform(scrollYProgress, [0.08, 0.88], [0, 1]);

  return (
    <section data-header-theme="light" ref={sectionRef} id="como-trabajamos" className={styles.section} aria-labelledby="how-we-work-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>05 / CÓMO TRABAJAMOS</p>
        <h2 id="how-we-work-title">Antes de hacer, entendemos.</h2>
        <p className={styles.introCopy}>
          Trabajamos junto a tu equipo para entender tus metas y plantear un plan personalizado.
        </p>
      </div>

      <div className={styles.stage}>
        <div className={styles.connectionLine} aria-hidden="true">
          <motion.span className={`${styles.connectionProgress} ${styles.connectionProgressDesktop}`} style={reduced ? { scaleX: 1 } : { scaleX: lineProgress }} />
          <motion.span className={`${styles.connectionProgress} ${styles.connectionProgressMobile}`} style={reduced ? { scaleY: 1 } : { scaleY: lineProgress }} />
          <i className={styles.connectionCorner} />
        </div>
        {messages.map((message) => (
          <WorkMessage key={message.number} {...message} progress={scrollYProgress} reduced={reduced} />
        ))}
      </div>

      <div className={styles.closing}>
        <p>Todo empieza entendiendo dónde estás.</p>
        <Link href="/contacto">Agendar una sesión <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
