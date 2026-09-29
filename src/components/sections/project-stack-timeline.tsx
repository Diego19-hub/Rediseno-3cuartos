/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import type { CaseStudy } from "@/types/wordpress";
import { PinnedSection } from "@/components/motion/pinned-section";
import { ScrollTimeline } from "@/components/motion/scroll-timeline";
import styles from "./project-stack-timeline.module.css";

type ProjectStackTimelineProps = {
  projects: CaseStudy[];
  services: Map<number, string>;
};

export function ProjectStackTimeline({ projects, services }: ProjectStackTimelineProps) {
  const reduced = useReducedMotion() === true;
  if (projects.length === 0) return null;

  if (reduced) return <div className={styles.reducedList}>{projects.map((project, index) => <ProjectSceneCard key={project.id} project={project} index={index} total={projects.length} services={services} />)}</div>;

  const sceneHeight = Math.round((100 + Math.max(0, projects.length - 1) * 58) * 2.25);
  return <ScrollTimeline className={styles.timeline}>{(progress) => <PinnedSection className={styles.pinned} contentClassName={styles.stage} height={sceneHeight}>
    {projects.map((project, index) => <ProjectMoment key={project.id} project={project} index={index} total={projects.length} services={services} progress={progress} />)}
  </PinnedSection>}</ScrollTimeline>;
}

function ProjectMoment({ project, index, total, services, progress }: { project: CaseStudy; index: number; total: number; services: Map<number, string>; progress: MotionValue<number> }) {
  const focus = total === 1 ? 0.04 : 0.04 + (index / (total - 1)) * 0.78;
  const enterStart = Math.max(0, focus - 0.24);
  const holdEnd = Math.min(1, focus + 0.12);
  const exitEnd = Math.min(1, focus + 0.3);
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const x = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [isFirst ? "0vw" : "14vw", "0vw", "0vw", isLast ? "0vw" : "-7vw"]);
  const y = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [isFirst ? "0vh" : "20vh", "0vh", "0vh", isLast ? "0vh" : "-10vh"]);
  const scale = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [isFirst ? 1 : 0.78, 1, 1, isLast ? 1 : 0.88]);
  const opacity = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0.34]);
  const titleX = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [isFirst ? "0vw" : "8vw", "0vw", "0vw", isLast ? "0vw" : "-8vw"]);
  const titleY = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [isFirst ? "0vh" : "5vh", "0vh", "0vh", isLast ? "0vh" : "-4vh"]);
  const titleScale = useTransform(progress, [enterStart, focus, holdEnd, exitEnd], [isFirst ? 1 : 0.86, 1, 1, isLast ? 1 : 0.9]);
  return <motion.div className={styles.moment} style={{ x, y, scale, opacity, zIndex: index + 1 }}><ProjectSceneCard project={project} index={index} total={total} services={services} titleStyle={{ x: titleX, y: titleY, scale: titleScale }} /></motion.div>;
}

function ProjectSceneCard({ project, index, total, services, titleStyle }: { project: CaseStudy; index: number; total: number; services: Map<number, string>; titleStyle?: { x: MotionValue<string>; y: MotionValue<string>; scale: MotionValue<number> } }) {
  const image = project.gallery[0];
  const relatedServices = project.serviceIds.map((id) => services.get(id)).filter((name): name is string => Boolean(name));
  const metadata = [project.clientName.trim(), relatedServices.join(" · ")].filter(Boolean);
  const href = project.slug ? `/casos-de-exito/${project.slug}` : "/casos-de-exito";

  return <article className={styles.card}>
    <Link className={styles.mediaLink} href={href} aria-label={`Ver proyecto ${project.title}`}>
      <div className={styles.media}>{image?.url ? <img src={image.url} alt={image.alt || project.title} width={image.width || 1600} height={image.height || 900} loading={index === 0 ? "eager" : "lazy"} /> : <span className={styles.fallback} aria-hidden="true" />}<span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span></div>
    </Link>
    <div className={styles.copy}><p>{metadata.join(" / ")}</p><motion.h3 style={titleStyle}><Link href={href}>{project.title}</Link></motion.h3><Link href={href}>Ver proyecto <span aria-hidden="true">→</span></Link></div>
  </article>;
}
