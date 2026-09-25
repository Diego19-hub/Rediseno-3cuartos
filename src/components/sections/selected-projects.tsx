"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import type { SelectedProject } from "@/lib/wordpress/selected-projects";
import styles from "./selected-projects.module.css";

const MotionLink = motion(Link);

export function SelectedProjects({ projects }: { projects: SelectedProject[] }) {
  const reduced = useReducedMotion();
  return <section id="proyectos-seleccionados" className={styles.section} aria-labelledby="selected-projects-title">
    <div className={styles.intro}>
      <img className={styles.mark} src="/images/brand/logo.svg" alt="" aria-hidden="true" width="20" height="18" />
      <p className={styles.eyebrow}>04 / PROYECTOS SELECCIONADOS</p>
      <h2 id="selected-projects-title">Una selección del trabajo de 3Cuartos.</h2>
    </div>
    <div className={styles.projectList}>
      {projects.map((project, index) => <ProjectCard key={project.name} project={project} index={index} reduced={Boolean(reduced)} />)}
    </div>
  </section>;
}

function ProjectCard({ project, index, reduced }: { project: SelectedProject; index: number; reduced: boolean }) {
  const projectRef = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: projectRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], [28, 0, -28]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.045, 1, 1.045]);

  return <MotionLink
    ref={projectRef}
    href={project.slug ? `/casos-de-exito/${project.slug}` : "/casos-de-exito"}
    className={`${styles.project} ${styles[`project${index + 1}`]}`}
    initial={reduced ? false : { opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: reduced ? 0 : 0.55, ease: "easeOut" }}
  >
    <div className={styles.imageFrame}>
      {project.image ? <motion.img src={project.image.url} alt={project.image.alt || project.name} width={project.image.width} height={project.image.height} loading={index === 0 ? "eager" : "lazy"} style={reduced ? undefined : { y: imageY, scale: imageScale }} /> : <span className={styles.missingVisual} aria-hidden="true" />}
    </div>
    <div className={styles.projectMeta}><span>{project.number}</span><h3>{project.name}</h3></div>
  </MotionLink>;
}
