import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { CaseStudyCard, CtaSection, ServiceCard, Testimonial } from "@/components/sections/cards";
import { servicesProvisional } from "@/content/services.provisional";
import { getServicePageContent, getServicesPageContent } from "@/lib/wordpress/services";
import { serviceMetadata } from "@/lib/wordpress/service-metadata";
import { ServiceFeaturedImage } from "./service-featured-image";
import styles from "./service-detail.module.css";

type Props = { params: Promise<{ slug: string }> };

const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

const problemTitles: Record<string, string> = {
  "marketing-digital-demo": "Conecta tu marca con las personas correctas.",
  "diseno-branding-demo": "Una marca clara para avanzar.",
  "desarrollo-web-demo": "Una experiencia digital que funciona.",
};

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
  const problemTitle = problemTitles[service.slug] ?? service.summary;
  return <><main className={styles.page}><Container>
    <section className={styles.hero} aria-labelledby="service-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span aria-hidden="true">{String(service.order).padStart(2, "0")}</span> Servicio</p>
        <h1 id="service-title">{service.name}</h1>
        <p className={styles.summary}>{service.summary}</p>
        <div className={styles.heroActions}>
          {service.isProvisional && <ProvisionalBadge/>}
          <Button href={cta.url} target={externalCta ? "_blank" : undefined} rel={externalCta ? "noreferrer" : undefined}>{cta.label} <span aria-hidden="true">→</span></Button>
        </div>
      </div>
      <div className={styles.heroVisual}>
        {image ? <ServiceFeaturedImage className={styles.featuredImage} src={image.url} alt={image.alt || service.name} sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1100px) 42vw, 38vw" /> : <div className={styles.imageFallback} aria-hidden="true"><span>{String(service.order).padStart(2, "0")}</span></div>}
        {service.visualIdentifier ? <p className={styles.visualIdentifier}>{service.visualIdentifier}</p> : null}
      </div>
    </section>
    <section className={styles.overview} aria-label="Resumen del servicio">
      <article><p className={styles.eyebrow}>{servicesProvisional.service.problemLabel}</p><h2>{problemTitle}</h2></article>
      <article><p className={styles.eyebrow}>{servicesProvisional.service.valueLabel}</p><p>{service.description || service.summary}</p></article>
    </section>
    <section className={styles.capabilities} aria-labelledby="capabilities-title">
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>{servicesProvisional.service.capabilitiesLabel}</p><h2 id="capabilities-title">Capacidades y<br />entregables.</h2></div>
      {service.capabilities.length ? <ol className={styles.capabilityList}>{service.capabilities.map((capability, index) => <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span><h3>{capability}</h3></li>)}</ol> : <p className={styles.emptyCapabilities}>Sin capacidades publicadas para este servicio.</p>}
    </section>
    </Container>
    <section className={styles.process} aria-labelledby="process-title"><div className={styles.processInner}><p className={styles.eyebrow}>{servicesProvisional.service.processLabel}</p><h2 id="process-title">Una dirección<br />clara<br />en cada etapa.</h2><ol>{servicesProvisional.process.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol></div></section>
    <Container>
    {caseStudy && <section className={styles.related} aria-labelledby="related-case-title"><p className={styles.eyebrow}>Caso relacionado</p><h2 id="related-case-title">Una aplicación del sistema.</h2><div className={styles.relatedGrid}><CaseStudyCard caseStudy={caseStudy}/>{testimonial && <Testimonial testimonial={testimonial}/>}</div></section>}
    {relatedServices.length ? <section className={styles.related} aria-labelledby="related-services-title"><p className={styles.eyebrow}>{servicesProvisional.service.relatedLabel}</p><h2 id="related-services-title">Otras capacidades<br />que se conectan.</h2><div className={styles.relatedGrid}>{relatedServices.map((related) => <Link key={related.id} href={`/servicios/${related.slug}`}><ServiceCard service={related}/></Link>)}</div></section> : null}
    <CtaSection label={cta.label} url={cta.url}/>
  </Container></main><Footer/></>;
}
