"use client";

import { type ComponentType, useEffect, useState } from "react";
import Link from "next/link";
import type { ServicesStoryProps } from "@/components/sections/services-story";
import type { Service } from "@/types/wordpress";
import type { ContentSource } from "@/lib/wordpress/home";
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
      <section data-header-theme="dark" className={styles.mobileHero} aria-labelledby="services-title">
        <p className={styles.sectionEyebrow}>{intro.eyebrow}</p>
        <h1 id="services-title">
          <span>No hacemos piezas aisladas.</span>
          <span>Construimos soluciones.</span>
        </h1>
        <p>{intro.copy}</p>
      </section>
      <section data-header-theme="light" className={styles.mobileDisciplines} aria-labelledby="mobile-disciplines-title">
        <p className={styles.sectionEyebrow}>02 / LAS TRES DISCIPLINAS</p>
        <h2 id="mobile-disciplines-title">SISTEMA</h2>
        <p className={styles.mobileLead}>Las necesidades de un proyecto no siempre pertenecen a una sola disciplina.</p>
        <ol className={styles.mobileDisciplineList}>
          {mobileDisciplines.map((discipline) => (
            <li className={`${styles.mobileDisciplineBlock} ${styles.mobileReveal}`} key={discipline.index}>
              <span className={styles.mobileDisciplineNumber} aria-hidden="true">{discipline.index}</span>
              <div className={styles.mobileDisciplineContent}>
                <p className={styles.mobileDisciplineIndex}>{discipline.index}</p>
                <h3>
                  {discipline.displayName.map((line) => <span key={line}>{line}</span>)}
                </h3>
                <p className={styles.mobileDisciplineDescription}>{discipline.description}</p>
                <ul className={styles.mobileCapabilities} aria-label={`Capacidades de ${discipline.name}`}>
                  {discipline.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                </ul>
                {discipline.href ? <Link href={discipline.href} className={styles.mobileDisciplineLink}>
                  {discipline.linkLabel} <span aria-hidden="true">→</span>
                </Link> : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section data-header-theme="dark" className={styles.mobileConnection} aria-labelledby="mobile-connection-title">
        <p className={styles.sectionEyebrow}>CAPACIDADES CONECTADAS</p>
        <h2 id="mobile-connection-title">Los proyectos reales no siempre caben en una categoría.</h2>
        <div className={styles.mobileConnectionDiagram} aria-label="Marketing, Branding y Web conectados a un proyecto">
          <div className={styles.mobileConnectionSources}>
            <span>Marketing</span>
            <span>Branding</span>
            <span>Web</span>
          </div>
          <span className={styles.mobileConnectionTarget}>Proyecto <span aria-hidden="true">→</span></span>
        </div>
      </section>
      <section data-header-theme="light" className={styles.mobileMatrix} aria-labelledby="mobile-matrix-title">
        <p className={styles.sectionEyebrow}>MATRIZ DE CAPACIDADES</p>
        <h2 id="mobile-matrix-title">Una dirección. Múltiples capacidades.</h2>
        <div className={styles.mobileMatrixRows}>
          {mobileDisciplines.map((discipline) => (
            <div className={styles.mobileMatrixRow} key={discipline.index}>
              <div><span>{discipline.index}</span><h3>{discipline.name}</h3></div>
              <p>{discipline.capabilities.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>
      <section data-header-theme="dark" className={styles.mobileProblemEntry} aria-labelledby="mobile-problem-title">
        <p className={styles.sectionEyebrow}>ENTRADA POR PROBLEMA</p>
        <h2 id="mobile-problem-title">NO TIENES QUE SABER QUÉ SERVICIO NECESITAS.</h2>
        <p>Cuéntanos qué quieres resolver. Primero entendemos el problema y después definimos qué capacidades necesita el proyecto.</p>
        <Link href="/contacto">Cuéntanos tu proyecto <span aria-hidden="true">→</span></Link>
      </section>
    </main>
    <footer className={styles.mobileFooter}><strong>3cuartos</strong><Link href="/contacto">Cuéntanos tu proyecto <span aria-hidden="true">→</span></Link></footer>
  </>;
}
