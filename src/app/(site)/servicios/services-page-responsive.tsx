"use client";

import { type ComponentType, useEffect, useState } from "react";
import { motion, useTransform } from "framer-motion";
import Link from "next/link";
import type { ServicesStoryProps } from "@/components/sections/services-story";
import type { Service } from "@/types/wordpress";
import type { ContentSource } from "@/lib/wordpress/home";
import { Footer } from "@/components/layout/footer";
import { useMobileEditorialScroll } from "@/components/motion/use-mobile-editorial-scroll";
import styles from "./page.module.css";

type Discipline = {
  index: string;
  name: string;
  displayName: readonly string[];
  description: string;
  linkLabel: string;
  href?: string;
  capabilities: readonly string[];
};

export type ServicesPageProps = {
  intro: ServicesStoryProps["intro"];
  services: Service[];
  servicesSource: ContentSource;
};

export function ServicesPageResponsive({ intro, services, servicesSource }: ServicesPageProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [DesktopPage, setDesktopPage] = useState<ComponentType<ServicesPageProps> | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    let active = true;
    const update = () => {
      setIsDesktop(query.matches);
      if (!query.matches) {
        setDesktopPage(null);
        return;
      }
      import("./desktop-services-page").then((module) => {
        if (active) setDesktopPage(() => module.DesktopServicesPage);
      });
    };
    update();
    query.addEventListener("change", update);
    return () => {
      active = false;
      query.removeEventListener("change", update);
    };
  }, []);

  if (isDesktop && DesktopPage) return <DesktopPage intro={intro} services={services} servicesSource={servicesSource} />;
  return <MobileServicesPage intro={intro} services={services} servicesSource={servicesSource} />;
}

function MobileServicesPage({ intro, services, servicesSource }: ServicesPageProps) {
  const [listRef, listProgress, listMotionDisabled] = useMobileEditorialScroll<HTMLElement>();
  const [matrixRef, matrixProgress, matrixMotionDisabled] = useMobileEditorialScroll<HTMLElement>();
  const [problemRef, problemProgress, problemMotionDisabled] = useMobileEditorialScroll<HTMLElement>();
  const reducedMotion = listMotionDisabled || matrixMotionDisabled || problemMotionDisabled;
  const listTitleX = useTransform(listProgress, [0, 1], [-6, 4]);
  const listTitleY = useTransform(listProgress, [0, 1], [35, -8]);
  const listLeadX = useTransform(listProgress, [0, 1], [3, -3]);
  const listLeadY = useTransform(listProgress, [0, 1], [20, -5]);
  const matrixTitleX = useTransform(matrixProgress, [0, 1], [6, -6]);
  const matrixTitleY = useTransform(matrixProgress, [0, 1], [35, -8]);
  const matrixOpacity = useTransform(matrixProgress, [0, 1], [0.45, 1]);
  const matrixScale = useTransform(matrixProgress, [0, 1], [0.94, 1]);
  const problemTitleX = useTransform(problemProgress, [0, 1], [-6, 4]);
  const problemTitleY = useTransform(problemProgress, [0, 1], [35, -8]);
  const problemCopyX = useTransform(problemProgress, [0, 1], [3, -3]);
  const problemCopyY = useTransform(problemProgress, [0, 1], [20, -5]);
  const problemRuleScale = useTransform(problemProgress, [0, 1], [0.2, 1]);
  const problemEyebrowX = useTransform(problemProgress, [0, 1], [-8, 6]);
  const problemButtonX = useTransform(problemProgress, [0, 1], [4, -4]);
  const mobileDisciplines: readonly Discipline[] = services.map((service, index) => ({
      index: String(index + 1).padStart(2, "0"),
      name: service.name,
      displayName: service.name.split(/\s+/).filter(Boolean),
      description: service.summary || service.description,
      linkLabel: `Explorar ${service.name}`,
      href: servicesSource === "wordpress" ? `/servicios/${service.slug}` : undefined,
      capabilities: service.capabilities,
    }));
  return <>
    <main className={styles.mobilePage}>
      {intro.eyebrow || intro.copy ? <MobileServicesIntro intro={intro} /> : null}
      <motion.section ref={listRef} data-header-theme="light" className={styles.mobileDisciplines} aria-labelledby="mobile-disciplines-title">
        <motion.h2 id="mobile-disciplines-title" style={reducedMotion ? undefined : { x: listTitleX, y: listTitleY }}>SERVICIOS</motion.h2>
        <motion.p className={styles.mobileLead} style={reducedMotion ? undefined : { x: listLeadX, y: listLeadY }}>Nuestros servicios principales, perfectos para tu negocio.</motion.p>
        <ol className={styles.mobileDisciplineList}>
          {mobileDisciplines.map((discipline) => (
            <MobileServiceRow key={discipline.index} discipline={discipline} />
          ))}
        </ol>
      </motion.section>
      <motion.section ref={matrixRef} data-header-theme="light" className={styles.mobileMatrix} aria-labelledby="mobile-matrix-title">
        <motion.h1 className={styles.mobileMatrixTitle} id="mobile-matrix-title" style={reducedMotion ? undefined : { x: matrixTitleX, y: matrixTitleY, opacity: matrixOpacity, scale: matrixScale }}>Capacidades</motion.h1>
        <div className={styles.mobileMatrixRows}>
          {mobileDisciplines.map((discipline) => (
            <MobileMatrixRow key={discipline.index} discipline={discipline} index={Number(discipline.index) - 1} />
          ))}
        </div>
      </motion.section>
      <motion.section ref={problemRef} data-header-theme="dark" className={styles.mobileProblemEntry} aria-labelledby="mobile-problem-title">
        <motion.p className={styles.sectionEyebrow} style={reducedMotion ? undefined : { x: problemEyebrowX }}>ENTRADA POR PROBLEMA</motion.p>
        <motion.h2 id="mobile-problem-title" style={reducedMotion ? undefined : { x: problemTitleX, y: problemTitleY }}>NO TIENES QUE SABER QUÉ SERVICIO NECESITAS.</motion.h2>
        <motion.p style={reducedMotion ? undefined : { x: problemCopyX, y: problemCopyY }}>Cuéntanos qué quieres resolver. Primero entendemos el problema y después definimos qué capacidades necesita el proyecto.</motion.p>
        <ol className={styles.mobileProblemFlow} aria-label="Proceso de trabajo">
          <li>PROBLEMA</li><li>DIRECCIÓN</li><li>CAPACIDADES</li><li className={styles.mobileProblemFlowSolution}>SOLUCIÓN</li>
        </ol>
        <motion.div style={reducedMotion ? undefined : { x: problemButtonX }}><Link href="/contacto">Cuéntanos tu proyecto</Link></motion.div>
        <motion.span className={styles.mobileEditorialRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: problemRuleScale }} />
      </motion.section>
    </main>
    <Footer tone="dark" />
  </>;
}

function MobileServicesIntro({ intro }: { intro: ServicesStoryProps["intro"] }) {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLElement>();
  const eyebrowX = useTransform(progress, [0, 1], [8, -6]);
  const copyX = useTransform(progress, [0, 1], [3, -3]);
  const copyY = useTransform(progress, [0, 1], [20, -5]);
  const ruleScale = useTransform(progress, [0, 1], [0.2, 1]);

  return <motion.section ref={ref} data-header-theme="dark" className={styles.mobileHero} aria-label="Introducción a servicios">
    {intro.eyebrow ? <motion.p className={styles.sectionEyebrow} style={reducedMotion ? undefined : { x: eyebrowX }}>{intro.eyebrow}</motion.p> : null}
    {intro.copy ? <motion.p style={reducedMotion ? undefined : { x: copyX, y: copyY }}>{intro.copy}</motion.p> : null}
    <motion.span className={styles.mobileEditorialRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: ruleScale }} />
  </motion.section>;
}

function MobileServiceRow({ discipline }: { discipline: Discipline }) {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLLIElement>();
  const fromLeft = discipline.name.toLowerCase().includes("marketing") || discipline.name.toLowerCase().includes("desarrollo");
  const titleX = useTransform(progress, [0, 1], fromLeft ? [-6, 4] : [6, -4]);
  const titleY = useTransform(progress, [0, 1], [35, -8]);
  const detailsX = useTransform(progress, [0, 1], fromLeft ? [3, -3] : [-3, 3]);
  const detailsY = useTransform(progress, [0, 1], [24, -5]);
  const numberX = useTransform(progress, [0, 1], fromLeft ? [8, -6] : [-6, 8]);
  const lineScale = useTransform(progress, [0, 1], [0.2, 1]);
  return <motion.li ref={ref} className={styles.mobileDisciplineBlock}>
    <motion.span className={styles.mobileDisciplineNumber} aria-hidden="true" style={reducedMotion ? undefined : { x: numberX }}>{discipline.index}</motion.span>
    <div className={styles.mobileDisciplineContent}>
      <motion.div style={reducedMotion ? undefined : { x: titleX, y: titleY }}>
        <p className={styles.mobileDisciplineIndex}>{discipline.index}</p>
        <h3>{discipline.displayName.map((line) => <span key={line}>{line}</span>)}</h3>
      </motion.div>
      <motion.div style={reducedMotion ? undefined : { x: detailsX, y: detailsY }}>
        <p className={styles.mobileDisciplineDescription}>{discipline.description}</p>
        <ul className={styles.mobileCapabilities} aria-label={`Capacidades de ${discipline.name}`}>
          {discipline.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
        </ul>
        {discipline.href ? <Link href={discipline.href} className={styles.mobileDisciplineLink}>{discipline.linkLabel} <span aria-hidden="true">→</span></Link> : null}
      </motion.div>
    </div>
    <motion.span className={styles.mobileRowRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: lineScale }} />
  </motion.li>;
}

function MobileMatrixRow({ discipline, index }: { discipline: Discipline; index: number }) {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLDivElement>();
  const fromLeft = index % 2 === 0;
  const titleX = useTransform(progress, [0, 1], fromLeft ? [-6, 4] : [6, -4]);
  const titleY = useTransform(progress, [0, 1], [35, -8]);
  const listX = useTransform(progress, [0, 1], fromLeft ? [3, -3] : [-3, 3]);
  const listY = useTransform(progress, [0, 1], [24, -5]);
  const lineScale = useTransform(progress, [0, 1], [0.2, 1]);
  return <motion.div ref={ref} className={styles.mobileMatrixRow}>
    <motion.div style={reducedMotion ? undefined : { x: titleX, y: titleY }}><span>{discipline.index}</span><h3>{discipline.name}</h3></motion.div>
    <motion.p style={reducedMotion ? undefined : { x: listX, y: listY }}>{discipline.capabilities.join(" · ")}</motion.p>
    <motion.span className={styles.mobileRowRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: lineScale }} />
  </motion.div>;
}
