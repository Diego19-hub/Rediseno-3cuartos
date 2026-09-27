"use client";
import { type ComponentType, useEffect, useState } from "react";
import Link from "next/link";
import type { Service, TeamMember } from "@/types/wordpress";
import type { Testimonial } from "@/types/wordpress";
import { Footer } from "@/components/layout/footer";
import { FinalCta } from "@/components/sections/final-cta";
import { TeamSection } from "./team-section";
import styles from "./nosotros.module.css";

export type AboutPageProps = {
  team: TeamMember[];
  services: Service[];
  testimonial?: Testimonial;
  ctaLabel: string;
  ctaUrl: string;
};

export function AboutPageResponsive(props: AboutPageProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [DesktopPage, setDesktopPage] = useState<ComponentType<AboutPageProps> | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    let active = true;
    const update = () => {
      setIsDesktop(query.matches);
      if (!query.matches) {
        setDesktopPage(null);
        return;
      }
      import("./desktop-about-page").then((module) => {
        if (active) setDesktopPage(() => module.DesktopAboutPage);
      });
    };
    update();
    query.addEventListener("change", update);
    return () => {
      active = false;
      query.removeEventListener("change", update);
    };
  }, []);

  if (isDesktop && DesktopPage) return <DesktopPage {...props} />;
  return <MobileAboutPage {...props} />;
}

function MobileAboutPage({ team, services, ctaLabel, ctaUrl }: AboutPageProps) {
  return <>
    <main className={styles.mobileAbout}>
      <section data-header-theme="dark" className={`${styles.mobileAboutHero} ${styles.chapterDark}`} aria-labelledby="mobile-about-title">
        <p className={styles.eyebrow}>ESTRATEGIA, CREATIVIDAD Y TECNOLOGÍA</p>
        <h1 id="mobile-about-title">Todo conecta cuando existe una estrategia.</h1>
        <p>Marca, producto y comunicación trabajando como un solo sistema.</p>
        <div className={styles.mobileAboutActions}><Link href={ctaUrl}>{ctaLabel}</Link><Link href="/servicios">Explorar servicios</Link></div>
        <div className={styles.mobileRule} aria-hidden="true" />
      </section>
      <section className={styles.mobileAboutSection} aria-labelledby="mobile-who-title"><h2 id="mobile-who-title">Ideas, sistemas y experiencias con una dirección común.</h2><p>Desarrollamos soluciones y activos digitales orientados a objetivos empresariales, conectando estrategia, creatividad y tecnología.</p></section>
      <section className={`${styles.mobileAboutSection} ${styles.chapterDark}`} aria-labelledby="mobile-idea-title"><h2 id="mobile-idea-title">El nombre abre una forma de mirar el conjunto.</h2><p>La historia oficial de 3Cuartos tendrá aquí su espacio cuando exista una versión validada para compartir.</p></section>
      <section className={styles.mobileAboutSection} aria-labelledby="mobile-thinking-title"><h2 id="mobile-thinking-title">Tres capacidades que trabajan como un sistema.</h2><p>Cada proyecto puede necesitar una combinación distinta. La dirección compartida mantiene conectadas las decisiones.</p><div className={styles.mobileCapabilityList}>{services.map((service, index) => <Link href={`/servicios/${service.slug}`} key={service.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{service.name}</strong><span aria-hidden="true">↗</span></Link>)}</div></section>
      <section className={`${styles.mobileAboutSection} ${styles.chapterDark}`} aria-labelledby="mobile-process-title"><h1 id="mobile-process-title">Primero entendemos. Después construimos contigo.</h1><div className={styles.mobileStages}><div><span>01</span><h3>Entender</h3><p>Partimos del contexto, las metas y las necesidades reales del proyecto.</p></div><div><span>02</span><h3>Definir</h3><p>Ordenamos lo aprendido para plantear una dirección personalizada.</p></div><div><span>03</span><h3>Construir</h3><p>Desarrollamos la solución junto con el equipo.</p></div></div></section>
      <section className={styles.mobileAboutSection} aria-labelledby="mobile-together-title"><h2 id="mobile-together-title">Trabajamos junto con tu equipo para entender metas y contexto antes de definir el camino.</h2></section>
      <TeamSection team={team} />
      <FinalCta eyebrow="HABLEMOS" title="Construyamos algo que tenga dirección." description="Cuéntanos qué quieres construir, mejorar o transformar." ctaLabel={ctaLabel} ctaUrl={ctaUrl} compact />
    </main>
    <Footer tone="dark" />
  </>;
}
