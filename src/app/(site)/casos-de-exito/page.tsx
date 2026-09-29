import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { SelectedProjectsCarousel } from "@/components/sections/selected-projects";
import { ConfidenceBrandCarousel, type ConfidenceBrand } from "@/components/sections/confidence-section";
import { getCaseStudiesContent } from "@/lib/wordpress/case-studies";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import styles from "./selected-work.module.css";

export const metadata = { title: "Casos de éxito | 3cuartos", description: "Proyectos seleccionados desarrollados por 3Cuartos." };

export default async function CaseStudiesPage() {
  const content = await getCaseStudiesContent();
  const cases = content.cases.filter((item) => item.slug && item.title);
  const approvedTestimonial = content.testimonials.find((item) => item.quote.trim() && (process.env.NODE_ENV === "development" || !item.isProvisional));
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
          <div className={styles.heroIntro} aria-hidden="true" />
        </ScrollReveal>
        <div className={styles.heroIndex}>
          <p><span>PROYECTOS</span><span>SELECCIONADOS</span></p>
          <div className={styles.indexRule}><span>01 — 04</span></div>
        </div>
      </section>

      <SelectedProjectsCarousel projects={cases} services={content.services} title="Trabajo que toma forma." ctaLabel="" introReveal stackOnScroll />

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

      <section data-header-theme="light" className={styles.testimonials} aria-labelledby="testimonials-title">
        <div className={styles.testimonialsInner}>
          <ScrollReveal className={styles.testimonialQuote}>
            <h2 id="testimonials-title">TESTIMONIO</h2>
            {/* TODO: reemplazar por testimonio autorizado antes de publicar. */}
            <blockquote>{approvedTestimonial ? `“${approvedTestimonial.quote}”` : "“Una relación que continúa después de la entrega.”"}</blockquote>
            <p className={styles.testimonialSignature}>{approvedTestimonial ? `— ${approvedTestimonial.personName || approvedTestimonial.company || "TESTIMONIO"}` : "— TESTIMONIO PENDIENTE DE VALIDACIÓN"}</p>
          </ScrollReveal>
          <div className={styles.testimonialMeta}>
            <span>01 / 03</span>
            <span className={styles.validationNote}>CONTENIDO DEMO<br />PENDIENTE DE VALIDACIÓN</span>
          </div>
        </div>
      </section>

      <section data-header-theme="light" className={styles.collaborators} aria-labelledby="collaborators-title">
        <div className={styles.collaboratorsInner}>
          <h2 id="collaborators-title">Marcas y colaboraciones</h2>
          <ConfidenceBrandCarousel brands={collaborators} />
          <p className={styles.collaborationNote}>Relaciones y autorizaciones pendientes de validación.</p>
        </div>
      </section>

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
