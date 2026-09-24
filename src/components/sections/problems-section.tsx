"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styles from "./problems-section.module.css";

const problems = [
  { number: "01", headline: "Hay movimiento, pero no dirección.", discipline: "Estrategia", description: "Se hacen campañas, contenidos y acciones, pero sin una estrategia clara que ordene prioridades y objetivos." },
  { number: "02", headline: "La marca existe, pero no conecta.", discipline: "Creatividad", description: "La propuesta puede ser buena, pero la comunicación, identidad o experiencia no consiguen transmitir su verdadero valor." },
  { number: "03", headline: "El negocio crece, pero sus herramientas no.", discipline: "Tecnología", description: "Procesos manuales, sitios limitados y sistemas desconectados empiezan a frenar lo que antes funcionaba." },
];

// Scroll-scrubbing window for the provisional Problems video. Keep these
// constants together so the editorial range can be tuned without touching
// layout or the story mapping.
const START_TIME = 2.0;
const END_TIME = 4.0;

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function timeForProgress(rawProgress: number, duration: number) {
  const safeDuration = Math.max(0, duration);
  const endTime = Math.min(END_TIME, safeDuration);
  const startTime = Math.min(START_TIME, endTime);
  const progress = clampProgress(rawProgress);
  return Math.min(safeDuration, Math.max(0, startTime + progress * (endTime - startTime)));
}

export function ProblemsSection() {
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(false);
  const section = useRef<HTMLElement>(null);
  const story = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<number | null>(null);
  const progress = useRef(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const { scrollYProgress: videoProgress } = useScroll({ target: story, offset: ["start start", "end end"] });
  const introY = useTransform(scrollYProgress, [0.08, 0.25, 0.4], [0, -16, -110]);
  const introOpacity = useTransform(scrollYProgress, [0.25, 0.43], [1, 0.12]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(query.matches);
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
      const nextTime = reduced || compact
        ? Math.max(0, duration - 0.04)
        : timeForProgress(progress.current, duration);
      element.currentTime = nextTime;
    };

    element.addEventListener("loadedmetadata", setInitialFrame);
    if (element.readyState >= HTMLMediaElement.HAVE_METADATA) setInitialFrame();
    return () => {
      element.removeEventListener("loadedmetadata", setInitialFrame);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [compact, reduced, videoProgress]);

  useMotionValueEvent(videoProgress, "change", (nextProgress) => {
    progress.current = clampProgress(nextProgress);
    if (reduced || compact || frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const element = video.current;
      const duration = element?.duration;
      if (!element || duration === undefined || !Number.isFinite(duration) || duration <= 0) return;
      element.currentTime = timeForProgress(progress.current, duration);
    });
  });

  return <section data-header-theme="dark" ref={section} id="problemas" className={styles.section} aria-labelledby="problems-title">
    <motion.div className={styles.intro} style={reduced ? undefined : { y: introY, opacity: introOpacity }}>
      <div><p className={styles.eyebrow}>CUANDO ALGO NO ESTÁ CONECTANDO</p><h2 id="problems-title"><span>El problema</span> <span>rara vez está</span> <span>en una sola</span> <span>parte.</span></h2></div>
      <p className={styles.lead}>Una estrategia sin ejecución, una marca sin dirección o tecnología sin propósito terminan generando el mismo resultado: esfuerzos que no avanzan juntos.</p>
    </motion.div>
    <div ref={story} className={styles.storyGrid}>
      <aside className={styles.videoColumn} aria-hidden="true">
        <div className={styles.videoStage}>
          <video ref={video} className={styles.video} src="/video/problems-scroll.mp4" muted playsInline preload="metadata" tabIndex={-1} />
          <div className={styles.videoFallback} />
        </div>
      </aside>
      <div className={styles.copyColumn}>
        <div className={styles.problemList}>{problems.map((problem, index) => <ProblemMoment key={problem.number} problem={problem} index={index} reduced={Boolean(reduced)} />)}</div>
        <p className={styles.closing}>Por eso no trabajamos estas áreas por separado.</p>
      </div>
    </div>
  </section>;
}

function ProblemMoment({ problem, index, reduced }: { problem: (typeof problems)[number]; index: number; reduced: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 0.28, 0.62, 1], [index === 1 ? 120 : -120, 0, index === 1 ? -36 : 36, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.78, 1], [64, 0, -18, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.78, 1], [0.15, 1, 1, 0.3]);
  const lineScale = useTransform(scrollYProgress, [0.06, 0.34], [0.05, 1]);
  return <motion.article ref={ref} className={`${styles.problem} ${styles[`problem${index + 1}`]}`} style={reduced ? undefined : { x, y, opacity }}>
    <div className={styles.number} aria-hidden="true">{problem.number}</div>
    <div className={styles.problemBody}><p className={styles.discipline}>{problem.discipline}</p><h3>{problem.headline}</h3><p className={styles.description}>{problem.description}</p></div>
    <motion.span className={styles.momentLine} aria-hidden="true" style={reduced ? undefined : { scaleX: lineScale }} />
  </motion.article>;
}
