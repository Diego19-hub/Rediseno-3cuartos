import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { ServicesStory } from "@/components/sections/services-story";
import styles from "./page.module.css";
import type { ServicesPageProps } from "./services-page-responsive";

const provisionalServicesVideo = "/video/services-scroll-scrub.mp4";
export function DesktopServicesPage({ intro, services, servicesSource }: ServicesPageProps) {
  const visibleDisciplines = services.map((service, index) => ({ index: String(index + 1).padStart(2, "0"), name: service.name, href: servicesSource === "wordpress" ? `/servicios/${service.slug}` : undefined, capabilities: service.capabilities }));
  return <><main>
    <ServicesStory intro={intro} videoSrc={provisionalServicesVideo} />
    <section data-header-theme="light" className={styles.connected} aria-labelledby="connected-title"><div className={styles.connectedInner}><p className={styles.sectionEyebrow}>Disciplinas conectadas</p><div className={styles.connectedGrid}><h2 id="connected-title">Los proyectos reales no siempre<br />caben en una categoría.</h2><p>Un proyecto puede necesitar Branding + Web,<br />otro Marketing + Web y otro las tres disciplinas.</p></div><div className={styles.convergence} aria-hidden="true"><span /><span /><span /><i /></div></div></section>
    <section data-header-theme="light" className={styles.matrix} aria-labelledby="matrix-title"><div className={styles.matrixHeader}><p className={styles.sectionEyebrow}>Capacidades</p><h2 id="matrix-title">Una dirección.<br />Múltiples capacidades.</h2></div><div className={styles.disciplineList}>{visibleDisciplines.map((discipline) => <article className={styles.discipline} key={discipline.index}><div className={styles.disciplineTitle}><span>{discipline.index}</span><h3>{discipline.name}</h3>{discipline.href ? <Link href={discipline.href} aria-label={`Explorar ${discipline.name}`}>Explorar <span aria-hidden="true">→</span></Link> : null}</div><ul>{discipline.capabilities.map((capability, index) => <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span>{capability}</li>)}</ul></article>)}</div></section>
    <section data-header-theme="dark" className={styles.problemEntry} aria-labelledby="problem-entry-title"><div className={styles.problemEntryInner}><p className={styles.sectionEyebrow}>Entrada por problema</p><h2 id="problem-entry-title">NO TIENES QUE SABER<br />QUÉ SERVICIO NECESITAS.</h2><div className={styles.problemLine} aria-hidden="true" /><div className={styles.problemCopy}><h3>Cuéntanos qué quieres resolver.</h3><p>Primero entendemos el problema y después<br />definimos qué capacidades necesita el proyecto.</p><Link href="/contacto">Cuéntanos tu proyecto <span aria-hidden="true">→</span></Link></div></div></section>
  </main><Footer tone="dark" /></>;
}
