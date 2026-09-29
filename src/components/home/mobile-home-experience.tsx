"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CaseStudy, Service } from "@/types/wordpress";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SelectedProjectsCarousel } from "@/components/sections/selected-projects";
import styles from "./mobile-home-experience.module.css";

const problems = [
  { number: "01", discipline: "Estrategia", title: "Movimiento sin dirección.", description: "Se hacen campañas, contenidos y acciones, pero sin una estrategia clara que ordene prioridades y objetivos." },
  { number: "02", discipline: "Creatividad", title: "Marca sin conexión.", description: "La propuesta puede ser buena, pero la comunicación, identidad o experiencia no consiguen transmitir su verdadero valor." },
  { number: "03", discipline: "Tecnología", title: "Negocio, herramientas y objetivos sin alineación.", description: "Procesos manuales, sitios limitados y sistemas desconectados empiezan a frenar lo que antes funcionaba." },
] as const;

const faq = [
  { question: "¿Qué tipo de proyectos realiza 3Cuartos?", answer: "Trabajamos conectando estrategia, creatividad y tecnología para construir experiencias que funcionan como un solo sistema." },
  { question: "¿Cómo comienza un proyecto?", answer: "El punto de partida es entender dónde estás: trabajamos junto a tu equipo para entender sus metas y plantear un plan personalizado." },
  { question: "¿Las soluciones se adaptan a cada negocio?", answer: "Planteamos un plan personalizado a partir de las metas y el contexto que entendemos junto a tu equipo." },
] as const;

type MobileHomeExperienceProps = {
  ctaLabel: string;
  ctaUrl: string;
  projects: CaseStudy[];
  services: Service[];
  previewConfidence: boolean;
};

export function MobileHomeExperience({ ctaLabel, ctaUrl, projects, services, previewConfidence }: MobileHomeExperienceProps) {
  return <div className={styles.home}>
    <MobileHero ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
    <MobileProblems />
    <MobileDisciplines />
    <SelectedProjectsCarousel projects={projects} services={services} stackOnScroll />
    <MobileProcess />
    {previewConfidence ? <MobileConfidence /> : null}
    <MobileFaq />
    <MobileCta ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
    <footer className={styles.footer}><BrandLogo tone="light" /><Link href="/contacto">Cuéntanos tu proyecto <span aria-hidden="true">→</span></Link></footer>
  </div>;
}

function MobileHero({ ctaLabel, ctaUrl }: Pick<MobileHomeExperienceProps, "ctaLabel" | "ctaUrl">) {
  return <section className={`${styles.hero} ${styles.dark}`} aria-labelledby="mobile-home-title">
    <p className={styles.eyebrow}>ESTRATEGIA, CREATIVIDAD Y TECNOLOGÍA</p>
    <h1 id="mobile-home-title"><span>3Cuartos</span><span>Agencia Digital</span></h1>
    <p className={styles.heroCopy}>Marca, producto y comunicación trabajando como un solo sistema.</p>
    <div className={styles.actions}><Link className={styles.primaryAction} href={ctaUrl}>{ctaLabel}</Link><Link className={styles.secondaryAction} href="/servicios">Explorar servicios</Link></div>
    <div className={styles.heroRule} aria-hidden="true" />
  </section>;
}

function MobileProblems() {
  return <section id="problemas" className={`${styles.problems} ${styles.dark}`} aria-label="Problemas que resolvemos">
    <div className={styles.problemList}>{problems.map((problem) => <article className={styles.problem} key={problem.number}><span className={styles.index}>{problem.number}</span><p className={styles.discipline}>{problem.discipline}</p><h2>{problem.title}</h2><p>{problem.description}</p></article>)}</div>
  </section>;
}

function MobileDisciplines() {
  const disciplines = [["01", "Estrategia", "Ordenamos decisiones y prioridades."], ["02", "Creatividad", "Construimos una expresión que conecta."], ["03", "Tecnología", "Convertimos la dirección en experiencias útiles."]];
  return <section className={styles.disciplines} aria-labelledby="mobile-disciplines-title"><div className={styles.sectionIntro}><p className={styles.eyebrow}>UN SISTEMA, MÚLTIPLES CAPACIDADES</p><h2 id="mobile-disciplines-title">Tres disciplinas. Una misma dirección.</h2><p>Conectamos marca, producto y crecimiento para construir experiencias que funcionan como un solo sistema.</p></div><div className={styles.disciplineList}>{disciplines.map(([number, name, copy]) => <div className={styles.disciplineRow} key={number}><span>{number}</span><div><h3>{name}</h3><p>{copy}</p></div><i aria-hidden="true">↗</i></div>)}</div></section>;
}

function MobileProcess() {
  const stages = [
    ["01", "Entender", "Conocemos el contexto, el problema y las metas del proyecto."],
    ["02", "Definir", "Ordenamos las prioridades y establecemos una dirección clara."],
    ["03", "Crear", "Convertimos la estrategia en una solución visual y funcional."],
    ["04", "Lanzar", "Ponemos la solución en marcha y comprobamos su funcionamiento."],
    ["05", "Mejorar", "Medimos, aprendemos y optimizamos lo que sigue."],
  ] as const;
  return <section id="como-trabajamos" className={`${styles.process} ${styles.dark}`} aria-labelledby="mobile-process-title"><div className={styles.sectionIntro}><h2 id="mobile-process-title">Antes de hacer, entendemos.</h2><p>Trabajamos junto a tu equipo para entender tus metas y plantear un plan personalizado.</p></div><div className={styles.processList}>{stages.map(([number, title, description]) => <article key={number} className={styles.processRow}><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></article>)}</div><div className={styles.closing}><Link href="/contacto">Agendar una sesión <span aria-hidden="true">→</span></Link></div></section>;
}

function MobileConfidence() {
  const brands = [
    ["Answare IT", "/images/brand/answareit-display.png"],
    ["Calforce", ""],
    ["ReciclaGil", "/images/brand/reciclagil-display.png"],
    ["Senderos del Roble", "/images/brand/senderos-del-roble-display.png"],
  ] as const;
  return <section id="confianza" className={styles.confidence} aria-labelledby="mobile-confidence-title"><h2 id="mobile-confidence-title">La confianza se construye en equipo.</h2><div className={styles.demoRail} aria-label="Marcas participantes"><div className={styles.demoTrack}><div className={styles.demoGroup}>{brands.map(([name, src]) => src ? <Image key={name} alt={name} src={src} width={160} height={48} /> : <span key={name}>{name}</span>)}</div><div className={styles.demoGroup} aria-hidden="true">{brands.map(([name, src]) => src ? <Image key={name} alt="" src={src} width={160} height={48} /> : <span key={name}>{name}</span>)}</div></div></div></section>;
}

function MobileFaq() {
  const [open, setOpen] = useState<number | null>(null);
  return <section id="preguntas-frecuentes" className={styles.faq} aria-labelledby="mobile-faq-title"><h2 id="mobile-faq-title">Lo esencial antes de empezar.</h2><div className={styles.faqList}>{faq.map((item, index) => { const isOpen = open === index; const answerId = `mobile-faq-answer-${index}`; return <div className={styles.faqItem} key={item.question}><button type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpen(isOpen ? null : index)}><span>{item.question}</span><span aria-hidden="true">+</span></button><div id={answerId} hidden={!isOpen}><p>{item.answer}</p></div></div>; })}</div></section>;
}

function MobileCta({ ctaLabel, ctaUrl }: Pick<MobileHomeExperienceProps, "ctaLabel" | "ctaUrl">) {
  return <section id="contacto" className={`${styles.cta} ${styles.dark}`} aria-labelledby="mobile-cta-title"><h2 id="mobile-cta-title">El siguiente proyecto puede empezar aquí.</h2><p>Cuéntanos qué quieres construir, mejorar o transformar. Empecemos por entenderlo.</p><Link href={ctaUrl}>{ctaLabel} <span aria-hidden="true">→</span></Link><p className={styles.disciplineNote}>ESTRATEGIA — CREATIVIDAD — TECNOLOGÍA</p></section>;
}
