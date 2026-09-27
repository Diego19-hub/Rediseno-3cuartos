import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { ImmersiveHome } from "@/components/immersive/immersive-home";
import { FinalCta } from "@/components/sections/final-cta";
import type { AboutPageProps } from "./about-page-responsive";
import { TeamSection } from "./team-section";
import styles from "./nosotros.module.css";

const processStages = [
  { title: "Entender", copy: "Partimos del contexto, las metas y las necesidades reales del proyecto." },
  { title: "Definir", copy: "Ordenamos lo aprendido para plantear una dirección y una solución personalizada." },
  { title: "Construir", copy: "Desarrollamos la solución junto con el equipo, conectando las capacidades necesarias." },
  { title: "Medir / mejorar", copy: "Observamos lo que el proyecto permite aprender para orientar las siguientes decisiones." },
] as const;

export function DesktopAboutPage({ team, services, ctaLabel, ctaUrl }: AboutPageProps) {
  const capabilities = services.map((service) => ({ discipline: service.name, capability: service.summary, href: `/servicios/${service.slug}` }));
  return <><ImmersiveHome services={services} ctaLabel={ctaLabel} ctaUrl={ctaUrl} showProjects={false} heroOnly /><main className={styles.page}>
    <section data-header-theme="light" className={`${styles.chapter} ${styles.who}`} aria-labelledby="who-title"><div className={styles.chapterMarker}><span>01</span><span>QUIÉNES SOMOS</span></div><div className={styles.chapterBody}><p className={styles.eyebrow}>3Cuartos</p><h2 id="who-title">Ideas, sistemas y experiencias con una dirección común.</h2><p className={styles.lead}>Desarrollamos soluciones y activos digitales orientados a objetivos empresariales, conectando estrategia, creatividad y tecnología.</p></div><p className={styles.sideNote}>No empezamos por una pieza aislada. Empezamos por entender qué necesita avanzar.</p></section>
    <section data-header-theme="dark" className={`${styles.chapter} ${styles.chapterDark} ${styles.idea}`} aria-labelledby="idea-title"><div className={styles.chapterMarker}><span>02</span><span>POR QUÉ 3CUARTOS</span></div><div className={styles.chapterBody}><p className={styles.eyebrow}>Una idea compartida</p><h2 id="idea-title">El nombre abre una forma de mirar el conjunto.</h2><p className={styles.bodyCopy}>La historia oficial de 3Cuartos tendrá aquí su espacio cuando exista una versión validada para compartir.</p></div><div className={styles.openLine} aria-hidden="true"><span /><span /></div></section>
    <section data-header-theme="light" className={`${styles.chapter} ${styles.thinking}`} aria-labelledby="thinking-title"><div className={styles.chapterMarker}><span>03</span><span>NUESTRA FORMA DE PENSAR</span></div><div className={styles.chapterBody}><p className={styles.eyebrow}>Una misma dirección</p><h2 id="thinking-title">Tres capacidades que trabajan como un sistema.</h2><p className={styles.lead}>Cada proyecto puede necesitar una combinación distinta. La dirección compartida mantiene conectadas las decisiones.</p></div><div className={styles.capacityList}>{capabilities.map((item, index) => <Link className={styles.capacity} href={item.href} key={item.href}><span className={styles.capacityIndex}>0{index + 1}</span><span className={styles.capacityNames}><strong>{item.discipline}</strong><small>{item.capability}</small></span><span className={styles.arrow} aria-hidden="true">↗</span></Link>)}</div></section>
    <section data-header-theme="light" className={styles.process} id="proceso" aria-labelledby="process-title"><div className={styles.processIntro}><div><p className={styles.eyebrow}>Una secuencia adaptable</p><h2 id="process-title">Primero entendemos. Después construimos contigo.</h2></div></div><ol className={styles.processList}>{processStages.map((stage, index) => <li key={stage.title} tabIndex={0}><span className={styles.processIndex}>0{index + 1}</span><div><h3>{stage.title}</h3><p>{stage.copy}</p></div></li>)}</ol></section>
    <section className={`${styles.chapter} ${styles.together}`} aria-labelledby="together-title"><div className={styles.chapterMarker}><span>05</span><span>TRABAJAMOS CONTIGO</span></div><div className={styles.chapterBody}><p className={styles.eyebrow}>Colaboración con contexto</p><h2 id="together-title"><span>Trabajamos junto con tu equipo</span><span>para entender metas, contexto</span><span>y necesidades antes de definir</span><span>el camino.</span></h2></div><p className={styles.sideNote}>Las decisiones se construyen con la información y la perspectiva de quienes conocen el negocio.</p></section>
    <TeamSection team={team} />
    <FinalCta eyebrow="Hablemos" title="Construyamos algo que tenga dirección." description="Cuéntanos qué quieres construir, mejorar o transformar." ctaLabel={ctaLabel} ctaUrl={ctaUrl} compact />
    </main><Footer tone="dark" /></>;
}
