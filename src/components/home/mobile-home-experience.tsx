"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { SelectedProject } from "@/lib/wordpress/selected-projects";
import styles from "./mobile-home-experience.module.css";

const problems = [
  { number: "01", discipline: "Estrategia", title: "Hay movimiento, pero no dirección.", description: "Se hacen campañas, contenidos y acciones, pero sin una estrategia clara que ordene prioridades y objetivos." },
  { number: "02", discipline: "Creatividad", title: "La marca existe, pero no conecta.", description: "La propuesta puede ser buena, pero la comunicación, identidad o experiencia no consiguen transmitir su verdadero valor." },
  { number: "03", discipline: "Tecnología", title: "El negocio crece, pero sus herramientas no.", description: "Procesos manuales, sitios limitados y sistemas desconectados empiezan a frenar lo que antes funcionaba." },
] as const;

const faq = [
  { question: "¿Qué tipo de proyectos realiza 3Cuartos?", answer: "Trabajamos conectando estrategia, creatividad y tecnología para construir experiencias que funcionan como un solo sistema." },
  { question: "¿Cómo comienza un proyecto?", answer: "El punto de partida es entender dónde estás: trabajamos junto a tu equipo para entender sus metas y plantear un plan personalizado." },
  { question: "¿Las soluciones se adaptan a cada negocio?", answer: "Planteamos un plan personalizado a partir de las metas y el contexto que entendemos junto a tu equipo." },
] as const;

type MobileHomeExperienceProps = {
  ctaLabel: string;
  ctaUrl: string;
  selectedProjects: SelectedProject[];
  previewConfidence: boolean;
};

export function MobileHomeExperience({ ctaLabel, ctaUrl, selectedProjects, previewConfidence }: MobileHomeExperienceProps) {
  return <div className={styles.home}>
    <MobileHero ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
    <MobileProblems />
    <MobileDisciplines />
    <MobileProjects projects={selectedProjects} />
    <MobileProcess />
    {previewConfidence ? <MobileConfidence /> : null}
    <MobileFaq />
    <MobileCta ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
    <footer className={styles.footer}><strong>3cuartos</strong><Link href="/contacto">Cuéntanos tu proyecto <span aria-hidden="true">→</span></Link></footer>
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
  return <section id="problemas" className={`${styles.problems} ${styles.dark}`} aria-labelledby="mobile-problems-title">
    <div className={styles.sectionIntro}><p className={styles.eyebrow}>CUANDO ALGO NO ESTÁ CONECTANDO</p><h2 id="mobile-problems-title">El problema rara vez está en una sola parte.</h2><p>Una estrategia sin ejecución, una marca sin dirección o tecnología sin propósito terminan generando el mismo resultado: esfuerzos que no avanzan juntos.</p></div>
    <div className={styles.problemList}>{problems.map((problem) => <article className={styles.problem} key={problem.number}><span className={styles.index}>{problem.number}</span><p className={styles.discipline}>{problem.discipline}</p><h3>{problem.title}</h3><p>{problem.description}</p></article>)}</div>
    <p className={styles.closing}>Por eso no trabajamos estas áreas por separado.</p>
  </section>;
}

function MobileDisciplines() {
  const disciplines = [["01", "Estrategia", "Ordenamos decisiones y prioridades."], ["02", "Creatividad", "Construimos una expresión que conecta."], ["03", "Tecnología", "Convertimos la dirección en experiencias útiles."]];
  return <section className={styles.disciplines} aria-labelledby="mobile-disciplines-title"><div className={styles.sectionIntro}><p className={styles.eyebrow}>UN SISTEMA, MÚLTIPLES CAPACIDADES</p><h2 id="mobile-disciplines-title">Tres disciplinas. Una misma dirección.</h2><p>Conectamos marca, producto y crecimiento para construir experiencias que funcionan como un solo sistema.</p></div><div className={styles.disciplineList}>{disciplines.map(([number, name, copy]) => <div className={styles.disciplineRow} key={number}><span>{number}</span><div><h3>{name}</h3><p>{copy}</p></div><i aria-hidden="true">↗</i></div>)}</div></section>;
}

function MobileProjects({ projects }: { projects: SelectedProject[] }) {
  return <section id="proyectos-seleccionados" className={styles.projects} aria-labelledby="mobile-projects-title"><div className={styles.sectionIntro}><p className={styles.eyebrow}>04 / PROYECTOS SELECCIONADOS</p><h2 id="mobile-projects-title">Una selección del trabajo de 3Cuartos.</h2></div><div className={styles.projectsList}>{projects.map((project) => <Link className={styles.project} href={project.slug ? `/casos-de-exito/${project.slug}` : "/casos-de-exito"} key={project.name}><div className={styles.projectMedia}><ProjectImage project={project} /></div><div className={styles.projectMeta}><span>{project.number}</span><h3>{project.name}</h3></div></Link>)}</div></section>;
}

function ProjectImage({ project }: { project: SelectedProject }) {
  if (!project.image) return null;
  const { url, alt, width = 1920, height = 1080 } = project.image;
  if (url.startsWith("/")) return <Image src={url} alt={alt || project.name} width={width} height={height} sizes="calc(100vw - 2.5rem)" loading="lazy" />;
  // WordPress hosts are not configured in next/image; keep their original URL without a fake resize.
  return <img src={url} alt={alt || project.name} loading="lazy" />; // eslint-disable-line @next/next/no-img-element
}

function MobileProcess() {
  const messages = [["01", "Trabajamos junto a tu equipo."], ["02", "Entendemos tus metas."], ["03", "Diseñamos un plan personalizado."]];
  return <section id="como-trabajamos" className={`${styles.process} ${styles.dark}`} aria-labelledby="mobile-process-title"><div className={styles.sectionIntro}><p className={styles.eyebrow}>05 / CÓMO TRABAJAMOS</p><h2 id="mobile-process-title">Antes de hacer, entendemos.</h2><p>Trabajamos junto a tu equipo para entender tus metas y plantear un plan personalizado.</p></div><div className={styles.processList}>{messages.map(([number, text]) => <div key={number} className={styles.processRow}><span>{number}</span><h3>{text}</h3></div>)}</div><div className={styles.closing}><p>Todo empieza entendiendo dónde estás.</p><Link href="/contacto">Agendar una sesión <span aria-hidden="true">→</span></Link></div></section>;
}

function MobileConfidence() {
  const brands = [
    ["Answare IT", "/images/brand/answareit-display.png"],
    ["Calforce", ""],
    ["ReciclaGil", "/images/brand/reciclagil-display.png"],
    ["Senderos del Roble", "/images/brand/senderos-del-roble-display.png"],
  ] as const;
  return <section id="confianza" className={styles.confidence} aria-labelledby="mobile-confidence-title"><p className={styles.eyebrow}>06 / CONFIANZA</p><h2 id="mobile-confidence-title">La confianza se construye en equipo.</h2><div className={styles.demoRail}>{brands.map(([name, src]) => src ? <Image key={name} src={src} alt={name} width={160} height={48} /> : <span key={name}>{name}</span>)}</div><blockquote>“Texto de muestra para revisar la composición editorial.”</blockquote></section>;
}

function MobileFaq() {
  const [open, setOpen] = useState<number | null>(null);
  return <section id="preguntas-frecuentes" className={styles.faq} aria-labelledby="mobile-faq-title"><p className={styles.eyebrow}>08 / PREGUNTAS FRECUENTES</p><h2 id="mobile-faq-title">Lo esencial antes de empezar.</h2><div className={styles.faqList}>{faq.map((item, index) => { const isOpen = open === index; const answerId = `mobile-faq-answer-${index}`; return <div className={styles.faqItem} key={item.question}><button type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpen(isOpen ? null : index)}><span>{item.question}</span><span aria-hidden="true">+</span></button><div id={answerId} hidden={!isOpen}><p>{item.answer}</p></div></div>; })}</div></section>;
}

function MobileCta({ ctaLabel, ctaUrl }: Pick<MobileHomeExperienceProps, "ctaLabel" | "ctaUrl">) {
  return <section id="contacto" className={`${styles.cta} ${styles.dark}`} aria-labelledby="mobile-cta-title"><p className={styles.eyebrow}>09 / HABLEMOS</p><h2 id="mobile-cta-title">El siguiente proyecto puede empezar aquí.</h2><p>Cuéntanos qué quieres construir, mejorar o transformar. Empecemos por entenderlo.</p><Link href={ctaUrl}>{ctaLabel} <span aria-hidden="true">→</span></Link><p className={styles.disciplineNote}>ESTRATEGIA — CREATIVIDAD — TECNOLOGÍA</p></section>;
}
