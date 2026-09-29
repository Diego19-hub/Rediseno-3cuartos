/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import type { CaseStudy, Service } from "@/types/wordpress";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ProjectStackTimeline } from "./project-stack-timeline";
import styles from "./selected-projects.module.css";

type CarouselStatus = "ready" | "loading" | "empty" | "error";

type SelectedProjectsCarouselProps = {
  projects: CaseStudy[];
  services?: Service[];
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  status?: CarouselStatus;
  introReveal?: boolean;
  stackOnScroll?: boolean;
};

export function SelectedProjectsCarousel({
  projects,
  services = [],
  title = "Una selección del trabajo de 3Cuartos.",
  ctaLabel = "Ver todos los casos →",
  ctaHref = "/casos-de-exito",
  status = "ready",
  introReveal = false,
  stackOnScroll = false,
}: SelectedProjectsCarouselProps) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const total = projects.length;
  const serviceNames = new Map(services.map((service) => [service.id, service.name]));

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track || cardRefs.current.length === 0) return;
    const closestIndex = cardRefs.current.reduce((closest, card, index) => {
      if (!card) return closest;
      const closestCard = cardRefs.current[closest];
      if (!closestCard) return index;
      return Math.abs(card.offsetLeft - track.scrollLeft) < Math.abs(closestCard.offsetLeft - track.scrollLeft) ? index : closest;
    }, 0);
    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => window.requestAnimationFrame(updateActiveIndex);
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [updateActiveIndex]);

  const moveTo = (nextIndex: number) => {
    const index = Math.min(Math.max(nextIndex, 0), Math.max(total - 1, 0));
    const target = cardRefs.current[index];
    trackRef.current?.scrollTo({ left: target?.offsetLeft ?? 0, behavior: reduced ? "auto" : "smooth" });
    setActiveIndex(index);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(activeIndex + 1);
    }
  };

  return <section id="proyectos-seleccionados" className={`${styles.section} ${introReveal ? styles.introReveal : ""} ${stackOnScroll ? styles.stackOnScroll : ""}`} aria-labelledby="selected-projects-title">
    <ScrollReveal className={styles.header}>
      <div className={styles.intro}>
        <h2 id="selected-projects-title">{title}</h2>
      </div>
      {ctaLabel && <Link className={styles.sectionCta} href={ctaHref}>{ctaLabel}</Link>}
    </ScrollReveal>

    {status === "loading" && <p className={styles.state}>Cargando proyectos…</p>}
    {status === "error" && <p className={styles.state}>No fue posible cargar los proyectos.</p>}
    {(status === "empty" || (status === "ready" && total === 0)) && <p className={styles.state}>No hay proyectos disponibles.</p>}

    {status === "ready" && total > 0 && <>
      {stackOnScroll && <ProjectStackTimeline projects={projects} services={serviceNames} />}
      <div className={styles.carousel}>
      <div className={styles.controls}>
        <span className={styles.counter} aria-live="polite">{String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <div className={styles.controlGroup}>
          <button type="button" className={styles.control} onClick={() => moveTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Proyecto anterior">←</button>
          <button type="button" className={styles.control} onClick={() => moveTo(activeIndex + 1)} disabled={activeIndex === total - 1} aria-label="Proyecto siguiente">→</button>
        </div>
      </div>
      <div className={styles.track} ref={trackRef} tabIndex={0} role="region" aria-label="Carrusel de proyectos seleccionados" onKeyDown={handleKeyDown}>
        {projects.map((project, index) => <ProjectCard
          key={project.id}
          project={project}
          index={index}
          total={total}
          active={index === activeIndex}
          services={serviceNames}
          cardRef={(card) => { cardRefs.current[index] = card; }}
        />)}
      </div>
      <div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${((activeIndex + 1) / total) * 100}%` }} /></div>
      </div>
    </>}
  </section>;
}

function ProjectCard({ project, index, total, active, services, cardRef }: { project: CaseStudy; index: number; total: number; active: boolean; services: Map<number, string>; cardRef: (card: HTMLElement | null) => void }) {
  const image = project.gallery[0];
  const relatedServices = project.serviceIds.map((id) => services.get(id)).filter((name): name is string => Boolean(name));
  const metadata = [project.clientName.trim(), relatedServices.join(" · ")].filter(Boolean);
  const href = project.slug ? `/casos-de-exito/${project.slug}` : "/casos-de-exito";

  return <article className={`${styles.card} ${active ? styles.cardActive : ""}`} ref={cardRef}>
    <ScrollReveal distance={24} direction="x">
    <Link className={styles.mediaLink} href={href} aria-label={`Ver proyecto ${project.title}`}>
      <div className={styles.media}>
        {image?.url ? <img src={image.url} alt={image.alt || project.title} width={image.width || 1600} height={image.height || 900} loading={index === 0 ? "eager" : "lazy"} /> : <span className={styles.missingVisual} aria-hidden="true" />}
        <span className={styles.mediaIndex}>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
    </Link>
    <div className={styles.cardBody}>
      <div className={styles.meta}>{metadata.map((item) => <span key={item}>{item}</span>)}</div>
      <h3><Link href={href}>{project.title}</Link></h3>
      <Link className={styles.cardCta} href={href}>Ver proyecto <span aria-hidden="true">→</span></Link>
    </div>
    </ScrollReveal>
  </article>;
}
