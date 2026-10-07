"use client";
import { type ComponentType, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
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
        <h1 id="mobile-about-title">About Us</h1>
        <p>Marca, producto y comunicación trabajando como un solo sistema.</p>
        <div className={styles.mobileAboutActions}><Link href={ctaUrl}>{ctaLabel}</Link><Link href="/servicios">Explorar servicios</Link></div>
        <div className={styles.mobileRule} aria-hidden="true" />
      </section>
      <MobileEditorialSection className={styles.mobileAboutSection} aria-labelledby="mobile-who-title"><h2 id="mobile-who-title">Ideas, sistemas y experiencias con una dirección común.</h2><p>Desarrollamos soluciones y activos digitales orientados a objetivos empresariales, conectando estrategia, creatividad y tecnología.</p></MobileEditorialSection>
      <MobileEditorialSection className={styles.mobileAboutSection} aria-labelledby="mobile-thinking-title"><h2 id="mobile-thinking-title">Tres capacidades que trabajan como un sistema.</h2><p>Cada proyecto puede necesitar una combinación distinta. La dirección compartida mantiene conectadas las decisiones.</p><div className={styles.mobileCapabilityList}>{services.map((service, index) => <Link href={`/servicios/${service.slug}`} key={service.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{service.name}</strong><span aria-hidden="true">↗</span></Link>)}</div></MobileEditorialSection>
      <section className={`${styles.mobileAboutSection} ${styles.chapterDark}`} aria-labelledby="mobile-process-title"><h1 id="mobile-process-title">Primero entendemos. Después construimos contigo.</h1><div className={styles.mobileStages}><div><span>01</span><h3>Entender</h3><p>Partimos del contexto, las metas y las necesidades reales del proyecto.</p></div><div><span>02</span><h3>Definir</h3><p>Ordenamos lo aprendido para plantear una dirección personalizada.</p></div><div><span>03</span><h3>Construir</h3><p>Desarrollamos la solución junto con el equipo.</p></div></div></section>
      <TeamSection team={team} />
      <FinalCta eyebrow="HABLEMOS" title="Construyamos algo que tenga dirección." description="Cuéntanos qué quieres construir, mejorar o transformar." ctaLabel={ctaLabel} ctaUrl={ctaUrl} compact />
    </main>
    <Footer tone="dark" />
  </>;
}

function MobileEditorialSection({ children, className, "aria-labelledby": labelledBy }: { children: ReactNode; className: string; "aria-labelledby": string }) {
  const reducedMotion = useReducedMotion() === true;
  return <motion.section className={className} aria-labelledby={labelledBy} initial={reducedMotion ? false : { opacity: 0.82, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.section>;
}
