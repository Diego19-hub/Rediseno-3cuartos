import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { SelectedProjectsCarousel } from "@/components/sections/selected-projects";
import { ConfidenceBrandCarousel, type ConfidenceBrand } from "@/components/sections/confidence-section";
import { getCaseStudiesContent } from "@/lib/wordpress/case-studies";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { CasesHeroMotion } from "./cases-hero-motion";
import styles from "./selected-work.module.css";

export const metadata = { title: "Casos de éxito | 3cuartos", description: "Proyectos seleccionados desarrollados por 3Cuartos." };

export default async function CaseStudiesPage() {
  const content = await getCaseStudiesContent();
  const cases = content.cases;
  const heroProjects = [
    { label: "ANSWARE IT", match: /answare/i },
    { label: "CALFORCE", match: /calforce/i },
    { label: "NATUO", match: /natuo/i },
  ].flatMap(({ label, match }) => {
    const project = cases.find((item) => match.test(`${item.clientName} ${item.title} ${item.slug}`));
    const image = project?.gallery[0];
    return project && image?.url ? [{ label, image }] : [];
  });
  const approvedTestimonial = content.testimonials.find((item) => item.quote.trim());
  const collaborators: readonly ConfidenceBrand[] = [
    { name: "Answare IT", logo: "/images/brand/answareit-display.png", approved: true },
    { name: "Calforce", approved: true },
    { name: "ReciclaGil", logo: "/images/brand/reciclagil-display.png", approved: true },
    { name: "Senderos del Roble", logo: "/images/brand/senderos-del-roble-display.png", approved: true },
  ];
  return <>
    <main className={styles.page}>
      <section data-header-theme="light" className={`${styles.hero} ${styles.reveal}`} aria-labelledby="cases-title">
        <ScrollReveal className={styles.heroCopy}>
          <p className={styles.eyebrow}>CASOS / TRABAJO</p>
          <h1 id="cases-title">Ideas que <span>toman forma.</span></h1>
          <p className={styles.heroIntro}>Diseño, desarrollo y tecnología para marcas que construyen el mañana.</p>
        </ScrollReveal>
        <CasesHeroMotion projects={heroProjects} />
      </section>

      <SelectedProjectsCarousel projects={cases} services={content.services} title="" ctaLabel="" introReveal fillViewport />

      <section data-header-theme="dark" className={styles.manifest} aria-labelledby="manifest-title">
        <div className={styles.manifestInner}>
          <ScrollReveal className={styles.manifestCopy}>
            <h2 id="manifest-title" className={styles.manifestTitle}>
              <span>De una idea clara</span>
              <span>a un negocio que avanza.</span>
            </h2>
            <p className={styles.manifestDescription}>Cada proyecto comienza entendiendo qué necesita cambiar y termina convirtiendo esa claridad en una solución real.</p>
          </ScrollReveal>
          <ol className={styles.manifestStages} aria-label="Progresión de un proyecto">
            {(["CLARIDAD", "DIRECCIÓN", "IDENTIDAD", "EXPERIENCIA", "RESULTADOS"] as const).map((stage) => <li key={stage} tabIndex={0} className={stage === "RESULTADOS" ? styles.manifestStageFinal : undefined}><span className={styles.stageNode} aria-hidden="true" /><span className={styles.stageLabel}>{stage}</span></li>)}
          </ol>
        </div>
      </section>

      {approvedTestimonial ? <section data-header-theme="light" className={styles.testimonials} aria-labelledby="testimonials-title">
        <div className={styles.testimonialsInner}>
          <ScrollReveal className={styles.testimonialQuote}>
            <h2 id="testimonials-title">TESTIMONIO</h2>
            <blockquote>“{approvedTestimonial.quote}”</blockquote>
            {(approvedTestimonial.personName || approvedTestimonial.company) ? <p className={styles.testimonialSignature}>— {[approvedTestimonial.personName, approvedTestimonial.company].filter(Boolean).join(" · ")}</p> : null}
          </ScrollReveal>
          <div className={styles.testimonialMeta}>
            <span>01 / 03</span>
          </div>
        </div>
      </section> : null}

      {collaborators.length ? <section data-header-theme="light" className={styles.collaborators} aria-labelledby="collaborators-title">
        <div className={styles.collaboratorsInner}>
          <h2 id="collaborators-title">Marcas y colaboraciones</h2>
          <ConfidenceBrandCarousel brands={collaborators} />
        </div>
      </section> : null}

      <section data-header-theme="dark" className={styles.finalCta} aria-labelledby="final-cta-title">
        <div className={styles.finalCtaInner}>
          <h2 id="final-cta-title"><span>TU PROYECTO</span><span>PUEDE SER EL SIGUIENTE.</span></h2>
          <p className={styles.finalCtaCopy}>Cuéntanos qué quieres construir.</p>
          <Link className={styles.finalCtaLink} href="/contacto">Cuéntanos tu proyecto →</Link>
        </div>
      </section>
    </main>
    <Footer tone="dark" />
  </>;
}
