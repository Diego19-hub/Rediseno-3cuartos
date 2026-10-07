"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { MediaAsset } from "@/types/wordpress";
import styles from "./cases-hero-motion.module.css";

type HeroProject = { label: string; image: MediaAsset };

export function CasesHeroMotion({ projects }: { projects: HeroProject[] }) {
  const reducedMotion = useReducedMotion();
  const orderedProjects = useMemo(() => {
    const calforce = projects.find((project) => project.label === "CALFORCE");
    const natuo = projects.find((project) => project.label === "NATUO");
    const answare = projects.find((project) => project.label === "ANSWARE IT");

    return [calforce, natuo, answare].filter((project): project is HeroProject => Boolean(project));
  }, [projects]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollFrame = useRef<number | null>(null);

  useEffect(() => () => {
    if (scrollFrame.current !== null) window.cancelAnimationFrame(scrollFrame.current);
  }, []);

  useEffect(() => {
    if (reducedMotion !== false || orderedProjects.length < 2) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % orderedProjects.length);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [activeIndex, orderedProjects.length, reducedMotion]);

  if (orderedProjects.length === 0) return null;

  const activeProject = orderedProjects[activeIndex];

  const handleExplore = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = document.getElementById("proyectos-seleccionados");
    if (!target) return;

    event.preventDefault();
    window.history.pushState(null, "", "#proyectos-seleccionados");

    if (scrollFrame.current !== null) window.cancelAnimationFrame(scrollFrame.current);

    const startY = window.scrollY;
    const headerOffset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-offset")) || 0;
    const endY = target.getBoundingClientRect().top + startY - headerOffset;
    if (reducedMotion !== false) {
      window.scrollTo({ top: endY, behavior: "auto" });
      return;
    }

    const startTime = performance.now();
    const duration = 2600;
    const animateScroll = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      window.scrollTo(0, startY + (endY - startY) * easedProgress);

      if (progress < 1) scrollFrame.current = window.requestAnimationFrame(animateScroll);
      else scrollFrame.current = null;
    };

    scrollFrame.current = window.requestAnimationFrame(animateScroll);
  };

  return (
    <>
      <div className={styles.scene} aria-hidden="true">
        {orderedProjects.map((project, index) => {
          const role = (index - activeIndex + orderedProjects.length) % orderedProjects.length;
          const roleClass = role === 0 ? "casesHeroPrimary" : role === 1 ? "casesHeroTop" : "casesHeroBottom";

          return (
            <div className={`casesHeroScreen ${roleClass}`} key={`${project.label}-${project.image.id}`}>
              {/* WordPress supplies the original full-resolution project captures. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.projectImage}
                src={project.image.url}
                alt=""
                width={project.image.width || 1907}
                height={project.image.height || 1080}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          );
        })}
      </div>
      <div className="casesHeroControls">
        <p>PROYECTOS<br />SELECCIONADOS</p>
        <Link className="casesHeroExplore" href="#proyectos-seleccionados" onClick={handleExplore} aria-label="Explorar casos de éxito">
          <span className="casesHeroExploreIcon" aria-hidden="true">→</span>
          <span>Explorar<br />casos de éxito</span>
        </Link>
        <div className="casesHeroProgress" role="group" aria-label={`Proyecto ${activeIndex + 1} de ${orderedProjects.length}: ${activeProject.label}`}>
          <div aria-hidden="true">
            {orderedProjects.map((project, index) => <span className={index === activeIndex ? "isActive" : ""} key={project.label} />)}
          </div>
          <span>{String(activeIndex + 1).padStart(2, "0")} / {String(orderedProjects.length).padStart(2, "0")}</span>
        </div>
      </div>
    </>
  );
}
