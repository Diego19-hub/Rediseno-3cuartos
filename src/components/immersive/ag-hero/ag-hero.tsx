"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import styles from "./ag-hero.module.css";

export function AgHero({ ctaLabel, ctaUrl }: { ctaLabel: string; ctaUrl: string }) {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const visualOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.92, 0.58]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -72]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);
  const transitionLineOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 0.82, 0.2]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reducedMotion]);

  return (
    <motion.section
      ref={heroRef}
      data-header-theme="dark"
      className={styles.hero}
      aria-labelledby="ag-hero-title"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.45 }}
    >
      <motion.div
        className={styles.visual}
        aria-hidden="true"
        style={reducedMotion ? undefined : { scale: visualScale, opacity: visualOpacity }}
        initial={reducedMotion ? false : { scale: 1.035, opacity: 0.72 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <video
          ref={videoRef}
          className={styles.video}
          src="/video/home-hero.mp4"
          poster="/video/home-hero-poster.jpg"
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
        />
        <div className={styles.contrast} />
      </motion.div>

      <motion.div
        className={styles.copy}
        style={reducedMotion ? undefined : { y: copyY, opacity: copyOpacity }}
        initial={reducedMotion ? false : { y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: reducedMotion ? 0 : 0.18, duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className={styles.eyebrow}>Estrategia, creatividad y tecnología</p>
        <h1 id="ag-hero-title"><span>Todo conecta</span><span>cuando existe</span><span>una estrategia.</span></h1>
        <p className={styles.description}>Marca, producto y comunicación trabajando como un solo sistema.</p>
        <div className={styles.ctas}>
          <Button href={ctaUrl}>{ctaLabel}</Button>
          <Button href="/servicios" variant="secondary">Explorar servicios</Button>
        </div>
      </motion.div>

      <motion.span
        className={styles.transitionLine}
        aria-hidden="true"
        style={reducedMotion ? undefined : { opacity: transitionLineOpacity }}
      />
      <div className={styles.disciplines} aria-label="Disciplinas del sistema">
        <span>Estrategia</span><span>Creatividad</span><span>Tecnología</span>
      </div>
      <p className={styles.cycleNote} aria-hidden="true">Ciclo autónomo · 8 segundos</p>
      <p className={styles.scrollHint} aria-hidden="true">Scroll para explorar ↓</p>
    </motion.section>
  );
}
