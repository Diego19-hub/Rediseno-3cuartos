"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./problems-section.module.css";

const problems = [
  { number: "01", headline: "Movimiento sin dirección.", discipline: "Estrategia", description: "Se hacen campañas, contenidos y acciones, pero sin una estrategia clara que ordene prioridades y objetivos." },
  { number: "02", headline: "Marca sin conexión.", discipline: "Creatividad", description: "La propuesta puede ser buena, pero la comunicación, identidad o experiencia no consiguen transmitir su verdadero valor." },
  { number: "03", headline: "Negocio, herramientas y objetivos sin alineación.", discipline: "Tecnología", description: "Procesos manuales, sitios limitados y sistemas desconectados empiezan a frenar lo que antes funcionaba." },
];

// The desktop video is scrubbed through a shorter editorial window so the
// three states arrive sooner while preserving the original asset and scenes.
const START_TIME = 2.0;
const END_TIME = 4.0;

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function timeForProgress(rawProgress: number, duration: number) {
  const safeDuration = Math.max(0, duration);
  const endTime = Math.min(END_TIME, safeDuration);
  const startTime = Math.min(START_TIME, endTime);
  return Math.min(safeDuration, Math.max(0, startTime + clampProgress(rawProgress) * (endTime - startTime)));
}

export function ProblemsSection() {
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const section = useRef<HTMLElement>(null);
  const story = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<number | null>(null);
  const progress = useRef(0);
  const { scrollYProgress: videoProgress } = useScroll({ target: story, offset: ["start start", "end end"] });

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;

    const setInitialFrame = () => {
      const duration = element.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      progress.current = clampProgress(videoProgress.get());
      element.currentTime = reduced ? Math.max(0, duration - 0.04) : timeForProgress(progress.current, duration);
    };

    element.addEventListener("loadedmetadata", setInitialFrame);
    if (element.readyState >= HTMLMediaElement.HAVE_METADATA) setInitialFrame();
    return () => {
      element.removeEventListener("loadedmetadata", setInitialFrame);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [mobile, reduced, videoProgress]);

  useMotionValueEvent(videoProgress, "change", (nextProgress) => {
    progress.current = clampProgress(nextProgress);
    if (mobile || reduced || frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const element = video.current;
      const duration = element?.duration;
      if (!element || duration === undefined || !Number.isFinite(duration) || duration <= 0) return;
      element.currentTime = timeForProgress(progress.current, duration);
    });
  });

  return <section data-header-theme="dark" ref={section} id="problemas" className={styles.section} aria-label="Problemas que resolvemos">
    <div ref={story} className={styles.storyGrid}>
      <aside className={styles.videoColumn} aria-hidden="true">
        <div className={styles.videoStage}>
          <div className={styles.videoFallback} />
          {!mobile && <video ref={video} className={styles.video} src="/video/problems-scroll.mp4" muted playsInline preload="metadata" tabIndex={-1} />}
        </div>
      </aside>
      <div className={styles.copyColumn}>
        <div className={styles.problemList}>{problems.map((problem, index) => <ProblemMoment key={problem.number} problem={problem} index={index} reduced={Boolean(reduced)} />)}</div>
      </div>
    </div>
  </section>;
}

function ProblemMoment({ problem, index, reduced }: { problem: (typeof problems)[number]; index: number; reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 0.28, 0.62, 1], [index === 1 ? "18vw" : "-18vw", "0vw", index === 1 ? "-8vw" : "8vw", "0vw"]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.78, 1], ["16vh", "0vh", "-4vh", "-12vh"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.78, 1], [0.15, 1, 1, 0.3]);
  const lineScale = useTransform(scrollYProgress, [0.06, 0.34], [0.05, 1]);
  const headlineX = useTransform(scrollYProgress, [0, 0.2, 0.78, 1], [index === 1 ? "-12vw" : "12vw", "0vw", index === 1 ? "8vw" : "-8vw", "0vw"]);
  const headlineY = useTransform(scrollYProgress, [0, 0.2, 0.78, 1], ["8vh", "0vh", "-3vh", "-8vh"]);
  const headlineScale = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.84, 1, 1, 0.9]);
  const headlineRotate = useTransform(scrollYProgress, [0, 0.2, 0.78, 1], [index === 1 ? 3 : -3, 0, 0, index === 1 ? -2 : 2]);

  return <motion.article ref={ref} className={`${styles.problem} ${styles[`problem${index + 1}`]}`} style={reduced ? undefined : { x, y, opacity }}>
    <div className={styles.number} aria-hidden="true">{problem.number}</div>
    <div className={styles.problemBody}><p className={styles.discipline}>{problem.discipline}</p><motion.h2 style={reduced ? undefined : { x: headlineX, y: headlineY, scale: headlineScale, rotate: headlineRotate }}>{problem.headline}</motion.h2><p className={styles.description}>{problem.description}</p></div>
    <motion.span className={styles.momentLine} aria-hidden="true" style={reduced ? undefined : { scaleX: lineScale }} />
  </motion.article>;
}
