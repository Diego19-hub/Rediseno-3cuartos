import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { ServicesStory } from "@/components/sections/services-story";
import { ServicesCapabilitiesMotion } from "./services-capabilities-motion";
import styles from "./page.module.css";
import type { ServicesPageProps } from "./services-page-responsive";

const provisionalServicesVideo = "/video/services-scroll-scrub.mp4";
const servicesHeroVideo = "/video/services-hero-combined-web.mp4";
export function DesktopServicesPage({ intro, services, servicesSource }: ServicesPageProps) {
  const heroIntro = { ...intro, copy: "" };
  const visibleDisciplines = services.map((service, index) => ({ index: String(index + 1).padStart(2, "0"), slug: service.slug, name: service.name, href: servicesSource === "wordpress" ? `/servicios/${service.slug}` : undefined, capabilities: service.capabilities }));
  return <><main>
    <ServicesStory intro={heroIntro} heroVideoSrc={servicesHeroVideo} videoSrc={provisionalServicesVideo} />
    <ServicesCapabilitiesMotion disciplines={visibleDisciplines} />
    <section data-header-theme="dark" className={styles.problemEntry} aria-labelledby="problem-entry-title"><div className={styles.problemEntryInner}><div className={styles.problemEntryLayout}><div className={styles.problemEntryCopy}><p className={styles.sectionEyebrow}>ENTRADA POR PROBLEMA</p><h2 id="problem-entry-title">NO TIENES QUE SABER<br />QUÉ SERVICIO NECESITAS.</h2><div className={styles.problemCopy}><h3>Cuéntanos qué quieres resolver.</h3><p>Primero entendemos el problema y después<br />definimos qué capacidades necesita el proyecto.</p><Link href="/contacto">Cuéntanos tu proyecto</Link></div></div><ol className={styles.problemFlow} aria-label="Proceso de trabajo"><li><h2>PROBLEMA</h2></li><li><h2>DIRECCIÓN</h2></li><li><h2>CAPACIDADES</h2></li><li className={styles.problemFlowSolution}><h2>SOLUCIÓN</h2></li></ol></div></div></section>
  </main><Footer tone="dark" /></>;
}
