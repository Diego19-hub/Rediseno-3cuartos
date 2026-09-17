import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { CtaSection, Metric, Testimonial } from "@/components/sections/cards";
import { caseStudyMetadata } from "@/lib/wordpress/case-study-metadata";
import { caseStudiesProvisional, getCaseStudiesContent, getCaseStudyPageContent } from "@/lib/wordpress/case-studies";
import styles from "../page.module.css";

type Props = { params: Promise<{ slug: string }> };

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
  const cta = caseStudy.cta.label && caseStudy.cta.url ? caseStudy.cta : { label: "Cuéntanos tu proyecto", url: "/#contacto" };
  return <><Header currentPath="/casos-de-exito"/><main><Container>
    <section className={`${styles.section} ${styles.breadcrumb}`}><Breadcrumb current={caseStudy.title} sectionLabel="Casos de éxito" sectionHref="/casos-de-exito"/></section>
    <section className={styles.hero}><div><p className={styles.eyebrow}>Caso de éxito</p><h1>{caseStudy.title}</h1><p>{caseStudy.clientName}</p><ProvisionalBadge/><Button href={cta.url}>{cta.label}</Button></div><MediaPlaceholder/></section>
    <section className={styles.detailGrid}><article className={styles.detailCard}><p className={styles.eyebrow}>{caseStudiesProvisional.detail.contextLabel}</p><p className={styles.copy}>{caseStudy.challenge}</p></article><article className={styles.detailCard}><p className={styles.eyebrow}>{caseStudiesProvisional.detail.objectivesLabel}</p><ul className={styles.list}>{caseStudy.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul><ProvisionalBadge/></article></section>
    <section className={styles.detailGrid}><article className={styles.detailCard}><p className={styles.eyebrow}>{caseStudiesProvisional.detail.strategyLabel}</p><p className={styles.copy}>{caseStudy.content}</p></article><article className={styles.detailCard}><p className={styles.eyebrow}>{caseStudiesProvisional.detail.solutionLabel}</p><p className={styles.copy}>{caseStudy.solution}</p></article></section>
    <section className={styles.section}><p className={styles.eyebrow}>{caseStudiesProvisional.detail.servicesLabel}</p><div className={styles.grid}>{appliedServices.map((service) => <article className={styles.detailCard} key={service.id}><h3>{service.name}</h3><ul className={styles.list}>{service.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul><ProvisionalBadge/></article>)}</div></section>
    <section className={styles.section}><p className={styles.eyebrow}>{caseStudiesProvisional.detail.metricsLabel}</p><div className={styles.grid}>{caseStudy.metrics.map((metric, index) => <Metric key={`${metric.label}-${index}`} metric={metric}/>)}</div><ul className={styles.list}>{caseStudy.results.map((result) => <li key={result}>{result}</li>)}</ul><ProvisionalBadge/></section>
    <section className={styles.section}><p className={styles.eyebrow}>{caseStudiesProvisional.detail.mediaLabel}</p><MediaPlaceholder/></section>
    {testimonial && <section className={styles.section}><Testimonial testimonial={testimonial}/></section>}
    {nextCase && <section className={styles.next}><div><p className={styles.eyebrow}>{caseStudiesProvisional.detail.nextLabel}</p><h2>{nextCase.title}</h2></div><Link href={`/casos-de-exito/${nextCase.slug}`}>Ver siguiente caso</Link></section>}
    <CtaSection label={cta.label} url={cta.url}/>
  </Container></main><Footer/></>;
}
