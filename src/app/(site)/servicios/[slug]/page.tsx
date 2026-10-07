import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CaseStudyCard, CtaSection, ServiceCard, Testimonial } from "@/components/sections/cards";
import { getServicePageContent, getServicesPageContent } from "@/lib/wordpress/services";
import { serviceMetadata } from "@/lib/wordpress/service-metadata";
import { ServiceFeaturedImage } from "./service-featured-image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { AmbientLottie } from "@/components/motion/ambient-lottie";
import { MarketingConnectionBridge } from "@/components/motion/marketing-connection-bridge";
import { getServiceMotion } from "@/lib/motion/service-motion-map";
import styles from "./service-detail.module.css";

type Props = { params: Promise<{ slug: string }> };
type CaseSignalGlyphName = "strategy" | "content" | "results";
type CapabilityGlyphName = "target" | "campaign" | "audience" | "content" | "conversion" | "report";

const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

function CaseSignalGlyph({ name }: { name: CaseSignalGlyphName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<CaseSignalGlyphName, ReactNode> = {
    strategy: <><path d="M4 19h16"/><path d="M7 16v-5"/><path d="M12 16V7"/><path d="M17 16V4"/></>,
    content: <><path d="M7 3h8l4 4v14H7z"/><path d="M15 3v5h4M10 12h6M10 16h6"/></>,
    results: <><path d="m4 17 5-5 4 3 7-8"/><path d="M14 7h6v6"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" {...common}>{paths[name]}</svg>;
}

function CapabilityGlyph({ name }: { name: CapabilityGlyphName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<CapabilityGlyphName, ReactNode> = {
    target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m12 12 7-7M16 5h3v3"/></>,
    campaign: <><path d="M4 14V9a1 1 0 0 1 1-1h3l9-4v14l-9-4H5a1 1 0 0 1-1-1Z"/><path d="m8 14 2 6h4l-3-5M20 8a6 6 0 0 1 0 7"/></>,
    audience: <><circle cx="9" cy="8" r="3"/><path d="M3.5 19v-1a5.5 5.5 0 0 1 11 0v1z"/><path d="M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8"/></>,
    content: <><path d="m4 17 10-10 4 4L8 21H4z"/><path d="m12 9 4 4M4 21l4-1M18 3l3 3"/></>,
    conversion: <><path d="M4 19h16"/><path d="M6 16v-4h3v4M11 16V8h3v8M16 16V4h3v12"/></>,
    report: <><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4M9 12h7M9 16h7"/></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" {...common}>{paths[name]}</svg>;
}

const capabilityGlyphs: CapabilityGlyphName[] = ["target", "campaign", "audience", "content", "conversion", "report"];

export async function generateStaticParams() {
  const content = await getServicesPageContent();
  return content.services.map((service) => ({ slug: service.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getServicePageContent((await params).slug);
  if (!content) return { title: "Servicio no encontrado | 3cuartos", robots: { index: false } };
  return serviceMetadata(content.service);
}

export default async function ServicePage({ params }: Props) {
  const content = await getServicePageContent((await params).slug);
  if (!content) notFound();
  const { service, caseStudy, testimonial, relatedServices } = content;
  const cta = service.cta.label && service.cta.url ? service.cta : { label: "Cuéntanos tu proyecto", url: "/#contacto" };
  const image = service.image;
  const externalCta = isExternalUrl(cta.url);
  const problemTitle = service.summary;
  const ambientMotion = getServiceMotion(service.slug);
  return <><main className={styles.page}><Container>
    <section className={styles.hero} aria-labelledby="service-title">
      {ambientMotion ? <AmbientLottie src={ambientMotion.hero} mobileSrc={ambientMotion.mobile} className={styles.heroAmbient} playbackSpeed={1.7} /> : null}
      {service.slug === "marketing-digital" ? <div className={styles.heroLabels} aria-hidden="true">
        <div className={`${styles.heroLabel} ${styles.heroLabelStrategy}`}><div className={styles.heroLabelTitle}><span>📊</span><strong>Estrategia</strong></div><span className={styles.heroLabelDescription}>Planeación<br />Posicionamiento<br />Objetivos</span></div>
        <div className={`${styles.heroLabel} ${styles.heroLabelAudience}`}><div className={styles.heroLabelTitle}><span>👥</span><strong>Audiencia</strong></div><span className={styles.heroLabelDescription}>Segmentación<br />Insights<br />Comunidad</span></div>
        <div className={`${styles.heroLabel} ${styles.heroLabelContent}`}><div className={styles.heroLabelTitle}><span>📄</span><strong>Contenido</strong></div><span className={styles.heroLabelDescription}>Creatividad<br />Multiformato<br />Distribución</span></div>
        <div className={`${styles.heroLabel} ${styles.heroLabelOptimization}`}><div className={styles.heroLabelTitle}><span>⚙️</span><strong>Optimización</strong></div><span className={styles.heroLabelDescription}>Análisis<br />Ajustes<br />Escala</span></div>
        <div className={`${styles.heroLabel} ${styles.heroLabelResults}`}><div className={styles.heroLabelTitle}><span>📈</span><strong>Resultados</strong></div><span className={styles.heroLabelDescription}>Conversión<br />Crecimiento<br />ROI</span></div>
      </div> : null}
      <div className={styles.heroCopy}><ScrollReveal>
        <h1 id="service-title">{service.name}</h1>
        <p className={styles.summary}>{service.summary}</p>
        <div className={styles.heroActions}>
          <Button href={cta.url} target={externalCta ? "_blank" : undefined} rel={externalCta ? "noreferrer" : undefined}>{cta.label} <span aria-hidden="true">→</span></Button>
        </div>
      </ScrollReveal></div>
      <div className={styles.heroVisual}>
        {image ? <ServiceFeaturedImage className={styles.featuredImage} src={image.url} alt={image.alt || service.name} sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1100px) 42vw, 38vw" /> : <div className={styles.imageFallback} aria-hidden="true"><span>{String(service.order).padStart(2, "0")}</span></div>}
        {service.visualIdentifier ? <p className={styles.visualIdentifier}>{service.visualIdentifier}</p> : null}
      </div>
    </section>
    <section className={`${styles.overview} ${service.slug === "marketing-digital" ? styles.marketingOverview : ""}`} aria-label="Resumen del servicio">
      {problemTitle ? <article><p className={styles.eyebrow}>Qué ayuda a resolver</p><h2>{problemTitle}</h2></article> : null}
      {service.description || service.summary ? <article><p className={styles.eyebrow}>Propuesta de valor</p><p>{service.description || service.summary}</p></article> : null}
      {service.slug === "marketing-digital" ? <MarketingConnectionBridge /> : null}
    </section>
    <section className={styles.capabilities} aria-labelledby="capabilities-title">
      {service.capabilities.length ? <><ScrollReveal className={`${styles.sectionHeading} ${service.slug === "marketing-digital" ? styles.sectionHeadingNoEyebrow : ""}`} mobileTranslationDistance={service.slug === "marketing-digital" ? 8 : undefined} mobileSettleAt={0.22}>{service.slug === "marketing-digital" ? null : <p className={styles.eyebrow}>Capacidades y entregables</p>}<h2 id="capabilities-title">Capacidades y<br />entregables.</h2></ScrollReveal>{service.slug === "marketing-digital" ? <div className={styles.capabilityPipeline}><svg className={styles.capabilityBranches} viewBox="0 0 500 600" preserveAspectRatio="none" aria-hidden="true"><path className={styles.capabilitySpine} d="M20 5V595"/><path className={styles.capabilityBranch} d="M20 50C-3 50 8 90 0 90M20 150C48 150 53 120 78 120S90 150 20 150M20 250C-8 250 0 300 35 300S54 270 20 250M20 350C50 350 60 380 86 380M20 450C-8 450 0 410 28 410S47 450 20 450M20 550C46 550 53 580 76 580"/></svg><span className={styles.capabilityPulse} aria-hidden="true"/><ol className={styles.capabilityList}>{service.capabilities.map((capability, index) => <li key={capability}><span className={styles.capabilityNumber}>{String(index + 1).padStart(2, "0")}</span><span className={styles.capabilityIcon}><CapabilityGlyph name={capabilityGlyphs[index] ?? "report"}/></span><h3>{capability}</h3></li>)}</ol></div> : <ol className={styles.capabilityList}>{service.capabilities.map((capability, index) => <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span><h3>{capability}</h3></li>)}</ol>}</> : null}
    </section>
    </Container>
    <Container>
    {caseStudy && <section className={styles.related} aria-labelledby="related-case-title">{service.slug === "marketing-digital" ? <h1 className={styles.relatedHeading} id="related-case-title">Caso relacionado</h1> : <><p className={styles.eyebrow}>Caso relacionado</p><h2 id="related-case-title">Una aplicación del sistema.</h2></>}{service.slug === "marketing-digital" ? <p className={styles.relatedIntro}>Estrategia, contenido y tecnología conectados para generar resultados reales.</p> : null}<div className={styles.relatedGrid}>{ambientMotion ? <AmbientLottie src={ambientMotion.relatedCase} mobileSrc={ambientMotion.relatedCaseMobile} className={styles.caseAmbient} playbackSpeed={1.5} mobilePlaybackSpeed={0.9} /> : null}{service.slug === "marketing-digital" ? <div className={styles.caseSignalLabels} aria-hidden="true"><span className={`${styles.caseSignalLabel} ${styles.caseStrategyLabel}`}><CaseSignalGlyph name="strategy"/>Estrategia</span><span className={`${styles.caseSignalLabel} ${styles.caseContentLabel}`}><CaseSignalGlyph name="content"/>Contenido</span><span className={`${styles.caseSignalLabel} ${styles.caseResultsLabel}`}><CaseSignalGlyph name="results"/>Resultados</span></div> : null}<CaseStudyCard caseStudy={caseStudy} featuredPreview={service.slug === "marketing-digital"} className={service.slug === "marketing-digital" ? styles.caseStudyCard : undefined}/>{testimonial && <Testimonial testimonial={testimonial}/>}</div></section>}
    {relatedServices.length ? <section className={styles.related} aria-labelledby="related-services-title">{service.slug === "marketing-digital" ? <h1 className={styles.relatedHeading} id="related-services-title">Servicios relacionados</h1> : <><p className={styles.eyebrow}>Servicios relacionados</p><h2 id="related-services-title">Otras capacidades<br />que se conectan.</h2></>}<div className={styles.relatedGrid}>{relatedServices.map((related) => <Link key={related.id} href={`/servicios/${related.slug}`}><ServiceCard service={related} showLabel={false} icon={related.slug === "diseno-branding" ? "branding" : related.slug === "desarrollo-web" ? "development" : related.slug === "marketing-digital" ? "marketing" : undefined}/></Link>)}</div></section> : null}
    {ambientMotion ? <div className={styles.marketingCtaFrame}><AmbientLottie src={ambientMotion.cta} mobileSrc={ambientMotion.ctaMobile} className={styles.ctaAmbient} playbackSpeed={3.6} mobilePlaybackSpeed={1.2}/><div className={styles.ctaSignalLabels} aria-hidden="true"><span className={`${styles.ctaSignalLabel} ${styles.ctaSignalIdeas}`}><span>💡</span>Ideas</span><span className={`${styles.ctaSignalLabel} ${styles.ctaSignalGrowth}`}><span>📊</span>Crecimiento</span><span className={`${styles.ctaSignalLabel} ${styles.ctaSignalResults}`}><span>📈</span>Resultados</span></div><CtaSection headingAs="h1" label="Hablemos" contact="Cuéntanos tu proyecto y exploremos cómo podemos llevar tu marca al siguiente nivel." url={cta.url} eyebrow=""/></div> : <CtaSection headingAs="h3" label={cta.label} url={cta.url} eyebrow={service.slug === "marketing-digital" ? "" : undefined}/>}
  </Container></main><Footer/></>;
}
