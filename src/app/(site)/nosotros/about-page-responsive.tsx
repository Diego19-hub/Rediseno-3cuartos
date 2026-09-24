"use client";
import { type ComponentType, useEffect, useState } from "react";
import Link from "next/link";
import type { Service, TeamMember } from "@/types/wordpress";
import type { Testimonial } from "@/types/wordpress";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
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

function MobileAboutPage({ team, services, testimonial, ctaLabel, ctaUrl }: AboutPageProps) {
  return <>
    <main className={styles.mobileAbout}>
      <section data-header-theme="dark" className={`${styles.mobileAboutHero} ${styles.chapterDark}`} aria-labelledby="mobile-about-title">
        <p className={styles.eyebrow}>ESTRATEGIA, CREATIVIDAD Y TECNOLOGÍA</p>
        <h1 id="mobile-about-title">Todo conecta cuando existe una estrategia.</h1>
        <p>Marca, producto y comunicación trabajando como un solo sistema.</p>
        <div className={styles.mobileAboutActions}><Link href={ctaUrl}>{ctaLabel}</Link><Link href="/servicios">Explorar servicios</Link></div>
        <div className={styles.mobileRule} aria-hidden="true" />
      </section>
      <section className={styles.mobileAboutSection} aria-labelledby="mobile-who-title"><p className={styles.eyebrow}>01 / QUIÉNES SOMOS</p><h2 id="mobile-who-title">Ideas, sistemas y experiencias con una dirección común.</h2><p>Desarrollamos soluciones y activos digitales orientados a objetivos empresariales, conectando estrategia, creatividad y tecnología.</p></section>
      <section className={`${styles.mobileAboutSection} ${styles.chapterDark}`} aria-labelledby="mobile-idea-title"><p className={styles.eyebrow}>02 / POR QUÉ 3CUARTOS</p><h2 id="mobile-idea-title">El nombre abre una forma de mirar el conjunto.</h2><p>La historia oficial de 3Cuartos tendrá aquí su espacio cuando exista una versión validada para compartir.</p></section>
      <section className={styles.mobileAboutSection} aria-labelledby="mobile-thinking-title"><p className={styles.eyebrow}>03 / CÓMO PENSAMOS</p><h2 id="mobile-thinking-title">Tres capacidades que trabajan como un sistema.</h2><p>Cada proyecto puede necesitar una combinación distinta. La dirección compartida mantiene conectadas las decisiones.</p><div className={styles.mobileCapabilityList}>{services.map((service, index) => <Link href={`/servicios/${service.slug}`} key={service.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{service.name}</strong><span aria-hidden="true">↗</span></Link>)}</div></section>
      <section className={`${styles.mobileAboutSection} ${styles.chapterDark}`} aria-labelledby="mobile-process-title"><p className={styles.eyebrow}>04 / CÓMO TRABAJAMOS</p><h2 id="mobile-process-title">Primero entendemos. Después construimos contigo.</h2><div className={styles.mobileStages}><div><span>01</span><h3>Entender</h3><p>Partimos del contexto, las metas y las necesidades reales del proyecto.</p></div><div><span>02</span><h3>Definir</h3><p>Ordenamos lo aprendido para plantear una dirección personalizada.</p></div><div><span>03</span><h3>Construir</h3><p>Desarrollamos la solución junto con el equipo.</p></div></div></section>
      <section className={styles.mobileAboutSection} aria-labelledby="mobile-together-title"><p className={styles.eyebrow}>05 / TRABAJAMOS CONTIGO</p><h2 id="mobile-together-title">Trabajamos junto con tu equipo para entender metas y contexto antes de definir el camino.</h2></section>
      <TeamSection team={team} />
      {testimonial?.quote.trim() ? <section className={styles.mobileAboutSection} aria-labelledby="mobile-testimonial-title"><p className={styles.eyebrow}>07 / TESTIMONIO</p><h2 id="mobile-testimonial-title">Lo que dicen de trabajar juntos.</h2><blockquote>“{testimonial.quote}”</blockquote><p>{[testimonial.personName, testimonial.jobTitle, testimonial.company].filter(Boolean).join(" · ")}</p>{testimonial.isProvisional ? <ProvisionalBadge /> : null}</section> : null}
      <section className={`${styles.mobileAboutCta} ${styles.chapterDark}`} aria-labelledby="mobile-about-cta-title"><p className={styles.eyebrow}>HABLEMOS</p><h2 id="mobile-about-cta-title">Construyamos algo que tenga dirección.</h2><p>Cuéntanos qué quieres construir, mejorar o transformar.</p><Link href="/contacto">Cuéntanos tu proyecto <span aria-hidden="true">→</span></Link></section>
    </main>
    <footer className={styles.mobileAboutFooter}><strong>3cuartos</strong><Link href="/contacto">Cuéntanos tu proyecto <span aria-hidden="true">→</span></Link></footer>
  </>;
}
