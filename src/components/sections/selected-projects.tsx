/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import type { CaseStudy, Service } from "@/types/wordpress";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ProjectStackTimeline } from "./project-stack-timeline";
import { useMobileEditorialScroll } from "@/components/motion/use-mobile-editorial-scroll";
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
  fillViewport?: boolean;
  mobileEditorialMotion?: boolean;
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
  fillViewport = false,
  mobileEditorialMotion = false,
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

  return <section id="proyectos-seleccionados" className={`${styles.section} ${introReveal ? styles.introReveal : ""} ${stackOnScroll ? styles.stackOnScroll : ""} ${fillViewport ? styles.fillViewport : ""}`} aria-labelledby={title ? "selected-projects-title" : undefined} aria-label={title ? undefined : "Proyectos seleccionados"}>
    {(title || ctaLabel) && (mobileEditorialMotion ? <MobileProjectsHeader title={title} ctaLabel={ctaLabel} ctaHref={ctaHref} /> : <ScrollReveal className={styles.header}>
      {title && <div className={styles.intro}>
        <h2 id="selected-projects-title">{title}</h2>
      </div>}
      {ctaLabel && <Link className={styles.sectionCta} href={ctaHref}>{ctaLabel}</Link>}
    </ScrollReveal>)}

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
          mobileEditorialMotion={mobileEditorialMotion}
          cardRef={(card) => { cardRefs.current[index] = card; }}
        />)}
      </div>
      <div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${((activeIndex + 1) / total) * 100}%` }} /></div>
      </div>
    </>}
  </section>;
}

function MobileProjectsHeader({ title, ctaLabel, ctaHref }: { title?: string; ctaLabel: string; ctaHref: string }) {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLDivElement>();
  const titleX = useTransform(progress, [0, 1], [-15, 8]);
  const titleY = useTransform(progress, [0, 1], [50, -10]);
  const linkX = useTransform(progress, [0, 1], [8, -4]);
  const linkY = useTransform(progress, [0, 1], [30, -5]);
  const ruleScale = useTransform(progress, [0, 1], [0.2, 1]);
  return <div ref={ref} className={styles.header}>
    {title && <motion.div className={styles.intro} style={reducedMotion ? undefined : { x: titleX, y: titleY }}><h2 id="selected-projects-title">{title}</h2></motion.div>}
    {ctaLabel && <motion.div style={reducedMotion ? undefined : { x: linkX, y: linkY }}><Link className={styles.sectionCta} href={ctaHref}>{ctaLabel}</Link></motion.div>}
    <motion.span className={styles.mobileRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: ruleScale }} />
  </div>;
}

type ProjectCardProps = { project: CaseStudy; index: number; total: number; active: boolean; services: Map<number, string>; cardRef: (card: HTMLElement | null) => void; mobileEditorialMotion: boolean };
type ProjectMotionStyles = { image: { y: MotionValue<number>; scale: MotionValue<number>; opacity: MotionValue<number> }; titleX: MotionValue<number>; titleY: MotionValue<number>; metaX: MotionValue<number>; metaY: MotionValue<number>; counterX: MotionValue<number> };

function ProjectCard(props: ProjectCardProps) {
  return props.mobileEditorialMotion ? <MobileMotionProjectCard {...props} /> : <StaticProjectCard {...props} />;
}

function StaticProjectCard({ project, index, total, active, services, cardRef }: ProjectCardProps) {
  return <article className={`${styles.card} ${active ? styles.cardActive : ""}`} ref={cardRef}>
    <ScrollReveal distance={24} direction="x"><ProjectCardContent project={project} index={index} total={total} services={services} /></ScrollReveal>
  </article>;
}

function MobileMotionProjectCard({ project, index, total, active, services, cardRef }: ProjectCardProps) {
  const [scrollRef, progress, reducedMotion] = useMobileEditorialScroll<HTMLElement>();
  const imageY = useTransform(progress, [0, 1], [60, -15]);
  const imageScale = useTransform(progress, [0, 1], [0.95, 1]);
  const imageOpacity = useTransform(progress, [0, 1], [0.65, 1]);
  const titleX = useTransform(progress, [0, 1], [-15, 8]);
  const titleY = useTransform(progress, [0, 1], [50, -10]);
  const metaX = useTransform(progress, [0, 1], [6, -4]);
  const metaY = useTransform(progress, [0, 1], [24, -5]);
  const counterX = useTransform(progress, [0, 1], [20, -10]);
  const motionStyles: ProjectMotionStyles | undefined = reducedMotion ? undefined : { image: { y: imageY, scale: imageScale, opacity: imageOpacity }, titleX, titleY, metaX, metaY, counterX };

  return <article className={`${styles.card} ${active ? styles.cardActive : ""}`} ref={(node) => { cardRef(node); scrollRef.current = node; }}>
    <ProjectCardContent project={project} index={index} total={total} services={services} motionStyles={motionStyles} />
  </article>;
}

function ProjectCardContent({ project, index, total, services, motionStyles }: { project: CaseStudy; index: number; total: number; services: Map<number, string>; motionStyles?: ProjectMotionStyles }) {
  const image = project.gallery[0];
  const relatedServices = project.serviceIds.map((id) => services.get(id)).filter((name): name is string => Boolean(name));
  const metadata = [project.clientName.trim(), relatedServices.join(" · ")].filter(Boolean);
  const href = project.slug ? `/casos-de-exito/${project.slug}` : "/casos-de-exito";
  return <>
    <Link className={styles.mediaLink} href={href} aria-label={`Ver proyecto ${project.title}`}>
      <div className={styles.media}>
        {image?.url ? motionStyles ? <motion.img className={styles.mobileParallaxImage} src={image.url} alt={image.alt || project.title} width={image.width || 1600} height={image.height || 900} loading={index === 0 ? "eager" : "lazy"} style={motionStyles.image} /> : <img src={image.url} alt={image.alt || project.title} width={image.width || 1600} height={image.height || 900} loading={index === 0 ? "eager" : "lazy"} /> : <span className={styles.missingVisual} aria-hidden="true" />}
        {motionStyles ? <motion.span className={styles.mediaIndex} style={{ x: motionStyles.counterX }}>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</motion.span> : <span className={styles.mediaIndex}>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>}
      </div>
    </Link>
    <div className={styles.cardBody}>
      {motionStyles ? <motion.div className={styles.meta} style={{ x: motionStyles.metaX, y: motionStyles.metaY }}>{metadata.map((item) => <span key={item}>{item}</span>)}</motion.div> : <div className={styles.meta}>{metadata.map((item) => <span key={item}>{item}</span>)}</div>}
      {motionStyles ? <motion.h3 style={{ x: motionStyles.titleX, y: motionStyles.titleY }}><Link href={href}>{project.title}</Link></motion.h3> : <h3><Link href={href}>{project.title}</Link></h3>}
      <Link className={styles.cardCta} href={href}>Ver proyecto <span aria-hidden="true">→</span></Link>
    </div>
  </>;
}
