"use client";

import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { CaseStudy, Service } from "@/types/wordpress";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SelectedProjectsCarousel } from "@/components/sections/selected-projects";
import { ConfidenceSection } from "@/components/sections/confidence-section";
import { useMobileEditorialScroll } from "@/components/motion/use-mobile-editorial-scroll";
import styles from "./mobile-home-experience.module.css";

const problems = [
  { number: "01", discipline: "Marketing", title: "Movimiento sin dirección.", description: "Se hacen campañas, contenidos y acciones, pero sin una estrategia clara que ordene prioridades y objetivos." },
  { number: "02", discipline: "Branding", title: "Marca sin conexión.", description: "La propuesta puede ser buena, pero la comunicación, identidad o experiencia no consiguen transmitir su verdadero valor." },
  { number: "03", discipline: "Desarrollo web", title: "Negocio, herramientas y objetivos sin alineación.", description: "Procesos manuales, sitios limitados y sistemas desconectados empiezan a frenar lo que antes funcionaba." },
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
};

export function MobileHomeExperience({ ctaLabel, ctaUrl, projects, services }: MobileHomeExperienceProps) {
  return <div className={styles.home}>
    <MobileHero ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
    <MobileProblems />
    <MobileDisciplines />
    <SelectedProjectsCarousel projects={projects} services={services} stackOnScroll mobileEditorialMotion />
    <MobileProcess />
    <ConfidenceSection mobileEditorialMotion />
    <MobileFaq />
    <MobileCta ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
    <footer className={styles.footer}><BrandLogo tone="light" /><Link href="/contacto">Cuéntanos tu proyecto <span aria-hidden="true">→</span></Link></footer>
  </div>;
}

function MobileHero({ ctaLabel, ctaUrl }: Pick<MobileHomeExperienceProps, "ctaLabel" | "ctaUrl">) {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLElement>();
  const titleX = useTransform(progress, [0, 1], [-15, 8]);
  const titleY = useTransform(progress, [0, 1], [50, -10]);
  const eyebrowX = useTransform(progress, [0, 1], [20, -10]);
  const copyX = useTransform(progress, [0, 1], [4, -4]);
  const copyY = useTransform(progress, [0, 1], [30, -5]);
  const ruleScale = useTransform(progress, [0, 1], [0.2, 1]);
  return <motion.section ref={ref} className={`${styles.hero} ${styles.dark}`} aria-labelledby="mobile-home-title">
    <motion.p className={styles.eyebrow} style={reducedMotion ? undefined : { x: eyebrowX }}>ESTRATEGIA, CREATIVIDAD Y TECNOLOGÍA</motion.p>
    <motion.h1 id="mobile-home-title" style={reducedMotion ? undefined : { x: titleX, y: titleY }}><span>3Cuartos</span><span>Agencia Digital</span></motion.h1>
    <motion.p className={styles.heroCopy} style={reducedMotion ? undefined : { x: copyX, y: copyY }}>Marca, producto y comunicación trabajando como un solo sistema.</motion.p>
    <div className={styles.actions}><Link className={styles.primaryAction} href={ctaUrl}>{ctaLabel}</Link><Link className={styles.secondaryAction} href="/servicios">Explorar servicios</Link></div>
    <motion.div className={styles.heroRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: ruleScale }} />
  </motion.section>;
}

function MobileProblems() {
  return <section id="problemas" className={`${styles.problems} ${styles.dark}`} aria-label="Problemas que resolvemos">
    <div className={styles.problemList}>{problems.map((problem, index) => <ProblemRow key={problem.number} problem={problem} index={index} />)}</div>
  </section>;
}

function ProblemRow({ problem, index }: { problem: (typeof problems)[number]; index: number }) {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLElement>();
  const direction = index % 2 === 0 ? -1 : 1;
  const titleX = useTransform(progress, [0, 1], direction === -1 ? [-15, 8] : [15, -8]);
  const titleY = useTransform(progress, [0, 1], [50, -10]);
  const eyebrowX = useTransform(progress, [0, 1], direction === -1 ? [20, -10] : [-10, 20]);
  const copyX = useTransform(progress, [0, 1], direction === -1 ? [4, -4] : [-4, 4]);
  const copyY = useTransform(progress, [0, 1], [30, -5]);
  const numberX = useTransform(progress, [0, 1], direction === -1 ? [20, -10] : [-10, 20]);
  const ruleScale = useTransform(progress, [0, 1], [0.2, 1]);
  return <motion.article ref={ref} className={styles.problem}>
    <motion.span className={styles.index} style={reducedMotion ? undefined : { x: numberX }}>{problem.number}</motion.span>
    <motion.p className={styles.discipline} style={reducedMotion ? undefined : { x: eyebrowX }}>{problem.discipline}</motion.p>
    <motion.h2 style={reducedMotion ? undefined : { x: titleX, y: titleY }}>{problem.title}</motion.h2>
    <motion.p style={reducedMotion ? undefined : { x: copyX, y: copyY }}>{problem.description}</motion.p>
    <motion.span className={styles.rowRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: ruleScale }} />
  </motion.article>;
}

function MobileDisciplines() {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLElement>();
  const eyebrowX = useTransform(progress, [0, 1], [20, -10]);
  const titleX = useTransform(progress, [0, 1], [15, -8]);
  const titleY = useTransform(progress, [0, 1], [50, -10]);
  const copyX = useTransform(progress, [0, 1], [4, -4]);
  const copyY = useTransform(progress, [0, 1], [30, -5]);
  const ruleScale = useTransform(progress, [0, 1], [0.2, 1]);
  const disciplines = [["01", "Estrategia", "Ordenamos decisiones y prioridades."], ["02", "Creatividad", "Construimos una expresión que conecta."], ["03", "Tecnología", "Convertimos la dirección en experiencias útiles."]];
  return <motion.section ref={ref} className={styles.disciplines} aria-labelledby="mobile-disciplines-title"><div className={styles.sectionIntro}><motion.p className={styles.eyebrow} style={reducedMotion ? undefined : { x: eyebrowX }}>UN SISTEMA, MÚLTIPLES CAPACIDADES</motion.p><motion.h2 id="mobile-disciplines-title" style={reducedMotion ? undefined : { x: titleX, y: titleY }}>Tres disciplinas. Una misma dirección.</motion.h2><motion.p style={reducedMotion ? undefined : { x: copyX, y: copyY }}>Conectamos marca, producto y crecimiento para construir experiencias que funcionan como un solo sistema.</motion.p></div><div className={styles.disciplineList}><motion.span className={styles.disciplineRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: ruleScale }} />{disciplines.map(([number, name, copy], index) => <DisciplineRow key={number} number={number} name={name} copy={copy} index={index} />)}</div></motion.section>;
}

function DisciplineRow({ number, name, copy, index }: { number: string; name: string; copy: string; index: number }) {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLDivElement>();
  const direction = index % 2 === 0 ? -1 : 1;
  const titleX = useTransform(progress, [0, 1], direction === -1 ? [-15, 8] : [15, -8]);
  const titleY = useTransform(progress, [0, 1], [50, -10]);
  const copyX = useTransform(progress, [0, 1], direction === -1 ? [4, -4] : [-4, 4]);
  const copyY = useTransform(progress, [0, 1], [30, -5]);
  const numberX = useTransform(progress, [0, 1], direction === -1 ? [20, -10] : [-10, 20]);
  const ruleScale = useTransform(progress, [0, 1], [0.2, 1]);
  return <motion.div ref={ref} className={styles.disciplineRow}>
    <motion.span style={reducedMotion ? undefined : { x: numberX }}>{number}</motion.span>
    <div><motion.h3 style={reducedMotion ? undefined : { x: titleX, y: titleY }}>{name}</motion.h3><motion.p style={reducedMotion ? undefined : { x: copyX, y: copyY }}>{copy}</motion.p></div>
    <i aria-hidden="true">↗</i><motion.span className={styles.disciplineRowRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: ruleScale }} />
  </motion.div>;
}

function MobileProcess() {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLElement>();
  const titleX = useTransform(progress, [0, 1], [15, -8]);
  const titleY = useTransform(progress, [0, 1], [50, -10]);
  const introX = useTransform(progress, [0, 1], [4, -4]);
  const introY = useTransform(progress, [0, 1], [30, -5]);
  const ruleScale = useTransform(progress, [0, 1], [0.2, 1]);
  const stages = [
    ["01", "Entender", "Conocemos el contexto, el problema y las metas del proyecto."],
    ["02", "Definir", "Ordenamos las prioridades y establecemos una dirección clara."],
    ["03", "Crear", "Convertimos la estrategia en una solución visual y funcional."],
    ["04", "Lanzar", "Ponemos la solución en marcha y comprobamos su funcionamiento."],
    ["05", "Mejorar", "Medimos, aprendemos y optimizamos lo que sigue."],
  ] as const;
  return <motion.section ref={ref} id="como-trabajamos" className={`${styles.process} ${styles.dark}`} aria-labelledby="mobile-process-title"><div className={styles.sectionIntro}><motion.h2 id="mobile-process-title" style={reducedMotion ? undefined : { x: titleX, y: titleY }}>Antes de hacer, entendemos.</motion.h2><motion.p style={reducedMotion ? undefined : { x: introX, y: introY }}>Trabajamos junto a tu equipo para entender tus metas y plantear un plan personalizado.</motion.p></div><div className={styles.processList}>{stages.map(([number, title, description], index) => <ProcessRow key={number} number={number} title={title} description={description} index={index} />)}</div><div className={styles.closing}><motion.span className={styles.processRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: ruleScale }} /><Link href="/contacto">Agendar una sesión <span aria-hidden="true">→</span></Link></div></motion.section>;
}

function ProcessRow({ number, title, description, index }: { number: string; title: string; description: string; index: number }) {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLElement>();
  const direction = index % 2 === 0 ? -1 : 1;
  const titleX = useTransform(progress, [0, 1], direction === -1 ? [-15, 8] : [15, -8]);
  const titleY = useTransform(progress, [0, 1], [50, -10]);
  const bodyX = useTransform(progress, [0, 1], direction === -1 ? [4, -4] : [-4, 4]);
  const bodyY = useTransform(progress, [0, 1], [30, -5]);
  const numberX = useTransform(progress, [0, 1], direction === -1 ? [20, -10] : [-10, 20]);
  return <motion.article ref={ref} className={styles.processRow}>
    <motion.span style={reducedMotion ? undefined : { x: numberX }}>{number}</motion.span>
    <div><motion.h2 style={reducedMotion ? undefined : { x: titleX, y: titleY }}>{title}</motion.h2><motion.p style={reducedMotion ? undefined : { x: bodyX, y: bodyY }}>{description}</motion.p></div>
  </motion.article>;
}

function MobileFaq() {
  const [open, setOpen] = useState<number | null>(null);
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLElement>();
  const titleX = useTransform(progress, [0, 1], [-15, 8]);
  const titleY = useTransform(progress, [0, 1], [50, -10]);
  const ruleScale = useTransform(progress, [0, 1], [0.2, 1]);
  return <motion.section ref={ref} id="preguntas-frecuentes" className={styles.faq} aria-labelledby="mobile-faq-title"><motion.h2 id="mobile-faq-title" style={reducedMotion ? undefined : { x: titleX, y: titleY }}>Lo esencial antes de empezar.</motion.h2><div className={styles.faqList}><motion.span className={styles.faqRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: ruleScale }} />{faq.map((item, index) => <FaqRow item={item} index={index} open={open} setOpen={setOpen} key={item.question} />)}</div></motion.section>;
}

function FaqRow({ item, index, open, setOpen }: { item: (typeof faq)[number]; index: number; open: number | null; setOpen: Dispatch<SetStateAction<number | null>> }) {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLDivElement>();
  const direction = index % 2 === 0 ? -1 : 1;
  const x = useTransform(progress, [0, 1], direction === -1 ? [-8, 4] : [8, -4]);
  const y = useTransform(progress, [0, 1], [30, -5]);
  const isOpen = open === index;
  const answerId = `mobile-faq-answer-${index}`;
  return <motion.div ref={ref} className={styles.faqItem} style={reducedMotion ? undefined : { x }}>
    <button type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpen(isOpen ? null : index)}><span>{item.question}</span><span aria-hidden="true">+</span></button>
    <div id={answerId} hidden={!isOpen}><motion.p style={reducedMotion ? undefined : { y }}>{item.answer}</motion.p></div>
  </motion.div>;
}

function MobileCta({ ctaLabel, ctaUrl }: Pick<MobileHomeExperienceProps, "ctaLabel" | "ctaUrl">) {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLElement>();
  const titleX = useTransform(progress, [0, 1], [15, -8]);
  const titleY = useTransform(progress, [0, 1], [50, -10]);
  const copyX = useTransform(progress, [0, 1], [4, -4]);
  const copyY = useTransform(progress, [0, 1], [30, -5]);
  const buttonX = useTransform(progress, [0, 1], [-8, 8]);
  const noteX = useTransform(progress, [0, 1], [20, -10]);
  const ruleScale = useTransform(progress, [0, 1], [0.2, 1]);
  return <motion.section ref={ref} id="contacto" className={`${styles.cta} ${styles.dark}`} aria-labelledby="mobile-cta-title"><motion.h2 id="mobile-cta-title" style={reducedMotion ? undefined : { x: titleX, y: titleY }}>El siguiente proyecto puede empezar aquí.</motion.h2><motion.p style={reducedMotion ? undefined : { x: copyX, y: copyY }}>Cuéntanos qué quieres construir, mejorar o transformar. Empecemos por entenderlo.</motion.p><motion.div style={reducedMotion ? undefined : { x: buttonX }}><Link href={ctaUrl}>{ctaLabel} <span aria-hidden="true">→</span></Link></motion.div><motion.p className={styles.disciplineNote} style={reducedMotion ? undefined : { x: noteX }}>ESTRATEGIA — CREATIVIDAD — TECNOLOGÍA</motion.p><motion.span className={styles.ctaRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: ruleScale }} /></motion.section>;
}
