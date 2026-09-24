"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import styles from "./ag-hero.module.css";

export function AgHero({ ctaLabel, ctaUrl }: { ctaLabel: string; ctaUrl: string }) {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <section data-header-theme="dark" className={styles.hero} aria-labelledby="ag-hero-title">
      <div className={styles.visual} aria-hidden="true">
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
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>Estrategia, creatividad y tecnología</p>
        <h1 id="ag-hero-title"><span>Todo conecta</span><span>cuando existe</span><span>una estrategia.</span></h1>
        <p className={styles.description}>Marca, producto y comunicación trabajando como un solo sistema.</p>
        <div className={styles.ctas}>
          <Button href={ctaUrl}>{ctaLabel}</Button>
          <Button href="/servicios" variant="secondary">Explorar servicios</Button>
        </div>
      </div>

      <div className={styles.disciplines} aria-label="Disciplinas del sistema">
        <span>Estrategia</span><span>Creatividad</span><span>Tecnología</span>
      </div>
      <p className={styles.cycleNote} aria-hidden="true">Ciclo autónomo · 8 segundos</p>
      <p className={styles.scrollHint} aria-hidden="true">Scroll para explorar ↓</p>
    </section>
  );
}
