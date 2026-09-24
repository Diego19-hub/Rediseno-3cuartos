/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { caseStudyMetadata } from "@/lib/wordpress/case-study-metadata";
import { getCaseStudiesContent, getCaseStudyPageContent } from "@/lib/wordpress/case-studies";
import type { MediaAsset } from "@/types/wordpress";
import styles from "./case-study-detail.module.css";

type Props = { params: Promise<{ slug: string }> };

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

const isExternalUrl = (value: string) => /^https?:\/\//i.test(value);

function CaseStudyMedia({ media, alt, className }: { media?: MediaAsset; alt: string; className?: string }) {
  if (!media || !isValidMediaUrl(media.url)) {
    return <div className={`${styles.mediaFrame} ${className ?? ""}`}><MediaPlaceholder label={`Imagen de ${alt} no disponible`} /></div>;
  }
  return <div className={`${styles.mediaFrame} ${className ?? ""}`}><img src={media.url} alt={media.alt || alt} width={media.width || 1920} height={media.height || 1200} /></div>;
}

export async function generateStaticParams() {
  return (await getCaseStudiesContent()).cases.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getCaseStudyPageContent((await params).slug);
  return content ? caseStudyMetadata(content.caseStudy) : { title: "Caso no encontrado | 3cuartos", robots: { index: false } };
}

export default async function CaseStudyPage({ params }: Props) {
  const content = await getCaseStudyPageContent((await params).slug);
  if (!content) notFound();

  const { caseStudy, appliedServices, testimonial, nextCase } = content;
  const cta = caseStudy.cta.label.trim() && caseStudy.cta.url.trim() ? caseStudy.cta : undefined;
  const solutionParagraphs = [caseStudy.content, caseStudy.solution].filter((value, index, values) => value.trim() && values.indexOf(value) === index);
  const additionalMedia = caseStudy.gallery.slice(1).filter((media) => isValidMediaUrl(media.url));

  return <>
    <main className={styles.page}>
      <Container className={styles.detailContainer}>
        <div className={styles.breadcrumb}>
          <Breadcrumb current={caseStudy.title} sectionLabel="Casos de éxito" sectionHref="/casos-de-exito" />
        </div>

        <section className={styles.hero} aria-labelledby="case-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>CASO DE ÉXITO</p>
            <h1 id="case-title">{caseStudy.title}</h1>
            {caseStudy.clientName && <p className={styles.client}>{caseStudy.clientName}</p>}
            {appliedServices.length > 0 && <ul className={styles.serviceList} aria-label="Servicios relacionados">
              {appliedServices.map((service) => <li key={service.id}>{service.name}</li>)}
            </ul>}
            {caseStudy.challenge && <p className={styles.heroSummary}>{caseStudy.challenge}</p>}
            {caseStudy.isProvisional && <ProvisionalBadge />}
            {cta && <Button className={styles.heroCta} href={cta.url} target={isExternalUrl(cta.url) ? "_blank" : undefined} rel={isExternalUrl(cta.url) ? "noreferrer" : undefined}>{cta.label} <span aria-hidden="true">→</span></Button>}
          </div>
          <CaseStudyMedia media={caseStudy.gallery[0]} alt={caseStudy.title} className={styles.heroMedia} />
        </section>

        <div className={styles.editorialFlow}>
          {caseStudy.challenge && <section className={styles.editorialSection} aria-labelledby="problem-title">
            <p className={styles.sectionIndex}>01 / PROBLEMA</p>
            <h2 id="problem-title">Problema</h2>
            <p>{caseStudy.challenge}</p>
          </section>}

          {caseStudy.objectives.length > 0 && <section className={styles.editorialSection} aria-labelledby="objectives-title">
            <p className={styles.sectionIndex}>02 / OBJETIVOS</p>
            <h2 id="objectives-title">Objetivos</h2>
            <ul className={styles.editorialList}>{caseStudy.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
          </section>}

          {solutionParagraphs.length > 0 && <section className={styles.editorialSection} aria-labelledby="solution-title">
            <p className={styles.sectionIndex}>03 / SOLUCIÓN</p>
            <h2 id="solution-title">Solución</h2>
            <div className={styles.prose}>{solutionParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>}

          {caseStudy.results.length > 0 && <section className={styles.editorialSection} aria-labelledby="results-title">
            <p className={styles.sectionIndex}>04 / RESULTADOS</p>
            <h2 id="results-title">Resultados</h2>
            <ul className={styles.editorialList}>{caseStudy.results.map((result) => <li key={result}>{result}</li>)}</ul>
          </section>}

          {caseStudy.metrics.length > 0 && <section className={styles.editorialSection} aria-labelledby="metrics-title">
            <p className={styles.sectionIndex}>05 / MÉTRICAS</p>
            <h2 id="metrics-title">Métricas</h2>
            <div className={styles.metrics}>{caseStudy.metrics.map((metric, index) => <article key={`${metric.label}-${index}`}>
              <strong>{metric.value}</strong>
              <h3>{metric.label}</h3>
              {metric.context && <p>{metric.context}</p>}
            </article>)}</div>
          </section>}

          {testimonial?.quote.trim() && <section className={styles.testimonial} aria-labelledby="testimonial-title">
            <p className={styles.sectionIndex}>TESTIMONIO</p>
            <h2 id="testimonial-title" className={styles.visuallyHidden}>Testimonio relacionado</h2>
            <div className={styles.testimonialContent}>
              {testimonial.image && <div className={styles.testimonialMedia}><CaseStudyMedia media={testimonial.image} alt={testimonial.personName || "Imagen del testimonio"} /></div>}
              <blockquote>“{testimonial.quote}”</blockquote>
              <div className={styles.testimonialDetails}>
                {testimonial.personName && <p className={styles.testimonialName}>{testimonial.personName}</p>}
                {testimonial.jobTitle && <p>{testimonial.jobTitle}</p>}
                {testimonial.company && <p>{testimonial.company}</p>}
                {testimonial.isProvisional && <span className={styles.provisionalBadge}>Provisional — cliente</span>}
              </div>
            </div>
          </section>}

          {additionalMedia.length > 0 && <section className={styles.editorialSection} aria-labelledby="gallery-title">
            <p className={styles.sectionIndex}>IMÁGENES ADICIONALES</p>
            <h2 id="gallery-title">Más del proyecto</h2>
            <div className={styles.gallery}>{additionalMedia.map((media) => <CaseStudyMedia media={media} alt={caseStudy.title} key={`${media.id}-${media.url}`} />)}</div>
          </section>}
        </div>

        {nextCase && <section className={styles.nextCase}>
          <div><p className={styles.eyebrow}>SIGUIENTE CASO</p><h2>{nextCase.title}</h2></div>
          <Link href={`/casos-de-exito/${nextCase.slug}`}>Ver siguiente caso →</Link>
        </section>}

        {cta && <section className={styles.finalCta} aria-labelledby="case-cta-title">
          <div><p className={styles.eyebrow}>HABLEMOS</p><h2 id="case-cta-title">Conversemos.</h2></div>
          <Button href={cta.url} target={isExternalUrl(cta.url) ? "_blank" : undefined} rel={isExternalUrl(cta.url) ? "noreferrer" : undefined}>{cta.label} <span aria-hidden="true">→</span></Button>
        </section>}
      </Container>
    </main>
    <Footer />
  </>;
}
