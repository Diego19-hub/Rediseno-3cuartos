import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { CaseStudyCard, CtaSection, ServiceCard, Testimonial } from "@/components/sections/cards";
import { servicesProvisional } from "@/content/services.provisional";
import { getServicePageContent, getServicesPageContent } from "@/lib/wordpress/services";
import { serviceMetadata } from "@/lib/wordpress/service-metadata";
import { ServiceFeaturedImage } from "./service-featured-image";
import styles from "../page.module.css";

type Props = { params: Promise<{ slug: string }> };

const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

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
  return <><main><Container>
    <section className={`${styles.section} ${styles.breadcrumb}`}><Breadcrumb current={service.name}/></section>
    <section className={`${styles.hero} ${styles.serviceHero}`}><div><p className={styles.eyebrow}>Servicio</p><h1>{service.name}</h1><p>{service.summary}</p><ProvisionalBadge/><Button href={cta.url} target={externalCta ? "_blank" : undefined} rel={externalCta ? "noreferrer" : undefined}>{cta.label} <span aria-hidden="true">→</span></Button></div><div className={styles.connection}>{image ? <ServiceFeaturedImage className={styles.connectionMedia} src={image.url} alt={image.alt || service.name} sizes="(max-width: 767px) 100vw, 36vw" /> : null}<p>{service.visualIdentifier || "Módulo de servicio"}</p><p>{service.description || service.summary}</p></div></section>
    <section className={styles.detailGrid}><article className={styles.detailCard}><p className={styles.eyebrow}>{servicesProvisional.service.problemLabel}</p><h2>{service.summary}</h2></article><article className={styles.detailCard}><p className={styles.eyebrow}>{servicesProvisional.service.valueLabel}</p><p className={styles.copy}>{service.description || service.summary}</p></article></section>
    <section className={styles.section}><p className={styles.eyebrow}>{servicesProvisional.service.capabilitiesLabel}</p><div className={styles.grid}>{service.capabilities.length ? service.capabilities.map((capability) => <article className={styles.detailCard} key={capability}><h3>{capability}</h3><ProvisionalBadge/></article>) : <article className={styles.detailCard}><p>Capacidades provisionales por confirmar.</p><ProvisionalBadge/></article>}</div></section>
    <section className={styles.section}><p className={styles.eyebrow}>{servicesProvisional.service.processLabel}</p><ol className={styles.process}>{servicesProvisional.process.map((step, index) => <li key={step}>0{index + 1} {step}</li>)}</ol></section>
    {caseStudy && <section className={styles.section}><p className={styles.eyebrow}>Caso relacionado</p><div className={styles.grid}><CaseStudyCard caseStudy={caseStudy}/>{testimonial && <Testimonial testimonial={testimonial}/>}</div></section>}
    <section className={styles.section}><p className={styles.eyebrow}>{servicesProvisional.service.relatedLabel}</p><div className={styles.grid}>{relatedServices.map((related) => <Link key={related.id} href={`/servicios/${related.slug}`}><ServiceCard service={related}/></Link>)}</div></section>
    <CtaSection label={cta.label} url={cta.url}/>
  </Container></main><Footer/></>;
}
