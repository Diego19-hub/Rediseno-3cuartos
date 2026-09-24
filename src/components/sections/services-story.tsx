"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./services-story.module.css";

export type ServicesStoryProps = {
  intro: { copy: string; eyebrow: string; title: string };
  videoSrc: string;
};

const narrative = [
  {
    index: "01",
    label: "Marketing Digital",
    title: "Marketing Digital",
    copy: "Estrategia, campañas, segmentación, optimización, seguimiento y reportes.",
  },
  {
    index: "02",
    label: "Branding",
    title: "Branding",
    copy: "Identidad, personalidad, imagen, tono, coherencia y diferenciación.",
  },
  {
    index: "03",
    label: "Desarrollo Web",
    title: "Desarrollo Web",
    copy: "Landing pages, sitios corporativos, e-commerce, responsive, CMS, frontend/backend, SEO e integraciones.",
  },
] as const;

function mapStoryProgress(progress: number) {
  const points = [
    [0, 0],
    [0.2, 0.2],
    [0.4, 0.4],
    [0.6, 0.6],
    [0.8, 0.8],
    [1, 1],
  ] as const;

  for (let index = 1; index < points.length; index += 1) {
    const [nextScroll, nextVideo] = points[index];
    const [previousScroll, previousVideo] = points[index - 1];

    if (progress <= nextScroll) {
      const localProgress = (progress - previousScroll) / (nextScroll - previousScroll);
      return previousVideo + (nextVideo - previousVideo) * Math.max(0, Math.min(1, localProgress));
    }
  }

  return 1;
}

export function ServicesStory({ intro, videoSrc }: ServicesStoryProps) {
  const storyRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);
  const progressRef = useRef(0);
  const targetTimeRef = useRef(0);
  const lastSeekTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateCompact = () => setIsCompact(mediaQuery.matches);
    updateCompact();
    mediaQuery.addEventListener("change", updateCompact);
    return () => mediaQuery.removeEventListener("change", updateCompact);
  }, []);

  const syncFrame = useCallback(() => {
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const video = videoRef.current;
      const duration = durationRef.current;
      if (!video || !Number.isFinite(duration) || duration <= 0) return;

      targetTimeRef.current = prefersReducedMotion || isCompact
        ? duration * 0.94
        : mapStoryProgress(progressRef.current) * duration;
      const targetTime = targetTimeRef.current;
      const displayedTime = video.currentTime;
      const lastSeekTime = lastSeekTimeRef.current ?? displayedTime;
      const threshold = 0.035;

      if (Math.abs(displayedTime - targetTime) <= threshold || Math.abs(lastSeekTime - targetTime) <= threshold) return;

      const boundedTarget = Math.min(Math.max(targetTime, 0), duration);
      if (Math.abs(displayedTime - boundedTarget) >= 0.5 && typeof video.fastSeek === "function") {
        video.fastSeek(boundedTarget);
      } else {
        video.currentTime = boundedTarget;
      }
      lastSeekTimeRef.current = boundedTarget;
    });
  }, [isCompact, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || isCompact) return;

    const updateProgress = () => {
      const story = storyRef.current;
      if (!story) return;

      const rect = story.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      progressRef.current = Math.max(0, Math.min(1, -rect.top / travel));
      syncFrame();
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [isCompact, prefersReducedMotion, syncFrame]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMetadata = () => {
      durationRef.current = video.duration;
      syncFrame();
    };

    if (video.readyState >= 1) handleMetadata();
    video.addEventListener("loadedmetadata", handleMetadata);
    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [syncFrame]);

  const reveal = prefersReducedMotion
    ? undefined
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { amount: 0.45 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <>
      <section data-header-theme="dark" className={styles.hero} aria-labelledby="services-title">
        <motion.article className={`${styles.chapter} ${styles.intro}`} {...reveal}>
          <div className={styles.chapterContent}>
            <p className={styles.eyebrow}>{intro.eyebrow}</p>
            <h1 id="services-title">{intro.title}</h1>
            <p className={styles.copy}>{intro.copy}</p>
          </div>
        </motion.article>
      </section>

      <section data-header-theme="dark" ref={storyRef} className={styles.story} aria-label="Las tres disciplinas">
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.videoStage}>
            <video ref={videoRef} className={styles.video} src={videoSrc} muted playsInline preload="auto" tabIndex={-1} />
            <div className={styles.videoOverlay} />
          </div>
        </div>

        <div className={styles.chapters}>
          <motion.article className={styles.chapter} {...reveal}>
            <div className={styles.chapterContent}>
              <p className={styles.step}>02 / LAS TRES DISCIPLINAS</p>
              <h2 className={styles.systemTitle}>Sistema</h2>
              <p className={styles.copy}>Las necesidades de un proyecto no siempre pertenecen a una sola disciplina.</p>
              <span className={styles.architecturalLine} aria-hidden="true" />
            </div>
          </motion.article>

          {narrative.map((item) => (
            <motion.article className={styles.chapter} key={item.index} {...reveal}>
              <div className={styles.chapterContent}>
                <div className={styles.disciplineHeading}>
                  <span className={styles.largeIndex} aria-hidden="true">{item.index}</span>
                  <p className={styles.step}>{item.label}</p>
                </div>
                <h2>{item.title}</h2>
                <p className={styles.copy}>{item.copy}</p>
                <span className={styles.architecturalLine} aria-hidden="true" />
              </div>
            </motion.article>
          ))}

          <motion.article className={`${styles.chapter} ${styles.finalChapter}`} {...reveal}>
            <div className={styles.chapterContent}>
              <p className={styles.step}>Conexión</p>
              <h2>Todo vuelve a conectarse.</h2>
              <span className={styles.architecturalLine} aria-hidden="true" />
            </div>
          </motion.article>
        </div>
      </section>
    </>
  );
}
