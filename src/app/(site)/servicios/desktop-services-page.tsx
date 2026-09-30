import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { ServicesStory } from "@/components/sections/services-story";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import styles from "./page.module.css";
import type { ServicesPageProps } from "./services-page-responsive";

const provisionalServicesVideo = "/video/services-scroll-scrub.mp4";
export function DesktopServicesPage({ intro, services, servicesSource }: ServicesPageProps) {
  const visibleDisciplines = services.map((service, index) => ({ index: String(index + 1).padStart(2, "0"), name: service.name, href: servicesSource === "wordpress" ? `/servicios/${service.slug}` : undefined, capabilities: service.capabilities }));
  return <><main>
    <ServicesStory intro={intro} videoSrc={provisionalServicesVideo} />
    <section data-header-theme="light" className={styles.matrix} aria-labelledby="matrix-title"><ScrollReveal className={styles.matrixHeader}><p className={styles.sectionEyebrow}>Capacidades</p><h2 id="matrix-title">Una dirección.<br />Múltiples capacidades.</h2></ScrollReveal><div className={styles.disciplineList}>{visibleDisciplines.map((discipline) => <article className={styles.discipline} key={discipline.index}><div className={styles.disciplineTitle}><span>{discipline.index}</span><h3>{discipline.name}</h3>{discipline.href ? <Link href={discipline.href} aria-label={`Explorar ${discipline.name}`}>Explorar <span aria-hidden="true">→</span></Link> : null}</div><ul>{discipline.capabilities.map((capability, index) => <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span>{capability}</li>)}</ul></article>)}</div></section>
    <section data-header-theme="dark" className={styles.problemEntry} aria-labelledby="problem-entry-title"><div className={styles.problemEntryInner}><div className={styles.problemEntryLayout}><div className={styles.problemEntryCopy}><p className={styles.sectionEyebrow}>ENTRADA POR PROBLEMA</p><h2 id="problem-entry-title">NO TIENES QUE SABER<br />QUÉ SERVICIO NECESITAS.</h2><div className={styles.problemCopy}><h3>Cuéntanos qué quieres resolver.</h3><p>Primero entendemos el problema y después<br />definimos qué capacidades necesita el proyecto.</p><Link href="/contacto">Cuéntanos tu proyecto</Link></div></div><ol className={styles.problemFlow} aria-label="Proceso de trabajo"><li><h2>PROBLEMA</h2></li><li><h2>DIRECCIÓN</h2></li><li><h2>CAPACIDADES</h2></li><li className={styles.problemFlowSolution}><h2>SOLUCIÓN</h2></li></ol></div></div></section>
  </main><Footer tone="dark" /></>;
}
