/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { getCaseStudiesContent } from "@/lib/wordpress/case-studies";
import styles from "./selected-work.module.css";

export const metadata = { title: "Casos de éxito | 3cuartos", description: "Proyectos seleccionados desarrollados por 3Cuartos." };

const isValidMediaUrl = (value: string | undefined): value is string => {
  if (!value) return false;
  if (value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export default async function CaseStudiesPage() {
  const content = await getCaseStudiesContent();
  const cases = content.cases.filter((item) => item.slug && item.title);
  const approvedTestimonial = content.testimonials.find((item) => item.quote.trim() && (process.env.NODE_ENV === "development" || !item.isProvisional));
  return <>
    <main className={styles.page}>
      <section data-header-theme="light" className={`${styles.hero} ${styles.reveal}`} aria-labelledby="cases-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>CASOS / TRABAJO</p>
          <h1 id="cases-title">Ideas que <span>toman forma.</span></h1>
          <p className={styles.heroIntro}>Una selección de proyectos y colaboraciones desarrolladas por 3Cuartos.</p>
        </div>
        <div className={styles.heroIndex}>
          <p><span>PROYECTOS</span><span>SELECCIONADOS</span></p>
          <div className={styles.indexRule}><span>01 — 04</span></div>
        </div>
      </section>

      {cases.map((caseStudy, index) => <section data-header-theme="light" className={`${styles.project} ${styles.reveal}`} aria-labelledby={`case-title-${caseStudy.id}`} key={caseStudy.id}>
        <div className={styles.projectCopy}>
          <p className={styles.projectIndex}>{String(index + 1).padStart(2, "0")} / 04</p>
          <Link className={styles.projectTitleLink} href={`/casos-de-exito/${caseStudy.slug}`}><h2 id={`case-title-${caseStudy.id}`}>{caseStudy.title}</h2></Link>
          <p className={styles.projectCategory}>{caseStudy.clientName || "PROYECTO SELECCIONADO"}</p>
        </div>
        <Link className={styles.projectMediaLink} href={`/casos-de-exito/${caseStudy.slug}`} aria-label={`Ver proyecto ${caseStudy.title}`}>
          <div className={styles.projectMedia}>
            {isValidMediaUrl(caseStudy.gallery[0]?.url) ? <img
              src={caseStudy.gallery[0].url}
              alt={caseStudy.gallery[0].alt || caseStudy.title}
              width={caseStudy.gallery[0].width || 1907}
              height={caseStudy.gallery[0].height || 1080}
              sizes="(max-width: 767px) 100vw, 65vw"
              loading={index === 0 ? "eager" : "lazy"}
            /> : <span className={styles.missingVisual} aria-hidden="true" />}
          </div>
        </Link>
      </section>)}

      <section data-header-theme="dark" className={styles.manifest} aria-labelledby="manifest-title">
        <div className={styles.manifestInner}>
          <p className={styles.manifestIndex}>03 / MANIFIESTO</p>
          <div className={styles.manifestLine} aria-hidden="true" />
          <h2 id="manifest-title">
            <span>Un proyecto no empieza</span>
            <span>con una solución.</span>
            <span>Empieza entendiendo qué</span>
            <span>necesita cambiar.</span>
          </h2>
        </div>
      </section>

      <section data-header-theme="light" className={styles.testimonials} aria-labelledby="testimonials-title">
        <div className={styles.testimonialsInner}>
          <div className={styles.testimonialQuote}>
            <p className={styles.sectionEyebrow}>04 / LO QUE DICEN</p>
            <h2 id="testimonials-title">DE TRABAJAR JUNTOS</h2>
            {/* TODO: reemplazar por testimonio autorizado antes de publicar. */}
            <blockquote>{approvedTestimonial ? `“${approvedTestimonial.quote}”` : "“Una relación que continúa después de la entrega.”"}</blockquote>
            <p className={styles.testimonialSignature}>{approvedTestimonial ? `— ${approvedTestimonial.personName || approvedTestimonial.company || "TESTIMONIO"}` : "— TESTIMONIO PENDIENTE DE VALIDACIÓN"}</p>
          </div>
          <div className={styles.testimonialMeta}>
            <span>01 / 03</span>
            <span className={styles.validationNote}>CONTENIDO DEMO<br />PENDIENTE DE VALIDACIÓN</span>
          </div>
        </div>
      </section>

      <section data-header-theme="light" className={styles.collaborators} aria-labelledby="collaborators-title">
        <div className={styles.collaboratorsInner}>
          <p className={styles.sectionEyebrow}>05 / MARCAS Y COLABORACIONES</p>
          <h2 id="collaborators-title">Relaciones que siguen tomando forma.</h2>
          <div className={styles.brandList} aria-label="Nombres provisionales pendientes de validación">
            <div className={styles.brandItem}>
              <Image
                className={styles.brandLogo}
                src="/images/brand/answareit-display.png"
                alt="Answare IT"
                width={512}
                height={512}
                sizes="(max-width: 767px) 70vw, 20vw"
              />
            </div>
            <div className={`${styles.brandItem} ${styles.brandWordmark}`}>CALFORCE</div>
            <div className={styles.brandItem}>
              <Image
                className={styles.brandLogo}
                src="/images/brand/reciclagil-display.png"
                alt="ReciclaGil"
                width={250}
                height={105}
                sizes="(max-width: 767px) 70vw, 20vw"
              />
            </div>
            <div className={styles.brandItem}>
              <Image
                className={styles.brandLogo}
                src="/images/brand/senderos-del-roble-display.png"
                alt="Senderos del Roble"
                width={512}
                height={512}
                sizes="(max-width: 767px) 70vw, 20vw"
              />
            </div>
          </div>
          <p className={styles.collaborationNote}>Relaciones y autorizaciones pendientes de validación.</p>
        </div>
      </section>

      <section data-header-theme="dark" className={styles.finalCta} aria-labelledby="final-cta-title">
        <div className={styles.finalCtaInner}>
          <p className={styles.sectionEyebrow}>06 / HABLEMOS</p>
          <h2 id="final-cta-title"><span>TU PROYECTO</span><span>PUEDE SER EL SIGUIENTE.</span></h2>
          <p className={styles.finalCtaCopy}>Cuéntanos qué quieres construir.</p>
          <Link className={styles.finalCtaLink} href="/contacto">Cuéntanos tu proyecto →</Link>
        </div>
      </section>
    </main>
    <Footer tone="dark" />
  </>;
}
