"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
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
      {projects.map((project, index) => <MotionLink key={project.name} href={project.slug ? `/casos-de-exito/${project.slug}` : "/casos-de-exito"} className={`${styles.project} ${styles[`project${index + 1}`]}`} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reduced ? 0 : 0.55, ease: "easeOut" }}>
        <div className={styles.imageFrame}>
          {project.image ? <img src={project.image.url} alt={project.image.alt || project.name} width={project.image.width} height={project.image.height} loading={index === 0 ? "eager" : "lazy"} /> : <span className={styles.missingVisual} aria-hidden="true" />}
        </div>
        <div className={styles.projectMeta}><span>{project.number}</span><h3>{project.name}</h3></div>
      </MotionLink>)}
    </div>
  </section>;
}
