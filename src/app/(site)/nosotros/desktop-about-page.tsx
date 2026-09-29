import { Footer } from "@/components/layout/footer";
import { ImmersiveHome } from "@/components/immersive/immersive-home";
import { FinalCta } from "@/components/sections/final-cta";
import type { AboutPageProps } from "./about-page-responsive";
import { TeamSection } from "./team-section";
import { EditorialScrollScene } from "@/components/motion/editorial-scroll-scene";
import { AboutManifestoScene } from "./about-manifesto-scene";
import { AboutProcessScene } from "./about-process-scene";
import styles from "./nosotros.module.css";

const processStages = [
  { title: "Entender", copy: "Partimos del contexto, las metas y las necesidades reales del proyecto." },
  { title: "Definir", copy: "Ordenamos lo aprendido para plantear una dirección y una solución personalizada." },
  { title: "Construir", copy: "Desarrollamos la solución junto con el equipo, conectando las capacidades necesarias." },
  { title: "Medir / mejorar", copy: "Observamos lo que el proyecto permite aprender para orientar las siguientes decisiones." },
] as const;

export function DesktopAboutPage({ team, services, ctaLabel, ctaUrl }: AboutPageProps) {
  const capabilities = services.map((service) => ({ discipline: service.name, capability: service.summary, href: `/servicios/${service.slug}` }));
  return <><ImmersiveHome services={services} ctaLabel={ctaLabel} ctaUrl={ctaUrl} showProjects={false} heroOnly motionProfile="about" /><main className={styles.page}>
    <AboutManifestoScene capabilities={capabilities} />
    <AboutProcessScene stages={processStages} />
    <EditorialScrollScene direction="right" intensity="strong" className={`${styles.chapter} ${styles.together}`} aria-labelledby="together-title"><div className={styles.chapterMarker}><span>05</span><span>TRABAJAMOS CONTIGO</span></div><div className={styles.chapterBody}><p className={styles.eyebrow}>Colaboración con contexto</p><h2 id="together-title"><span>Trabajamos junto con tu equipo</span><span>para entender metas, contexto</span><span>y necesidades antes de definir</span><span>el camino.</span></h2></div><p className={styles.sideNote}>Las decisiones se construyen con la información y la perspectiva de quienes conocen el negocio.</p></EditorialScrollScene>
    <TeamSection team={team} />
    <FinalCta eyebrow="Hablemos" title="Construyamos algo que tenga dirección." description="Cuéntanos qué quieres construir, mejorar o transformar." ctaLabel={ctaLabel} ctaUrl={ctaUrl} compact />
    </main><Footer tone="dark" /></>;
}
