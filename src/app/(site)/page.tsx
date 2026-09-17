import { Header } from "@/components/layout/header";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { CaseStudyCard, CtaSection, EditorialBlock, Metric, ResourceCard, ServiceCard, Testimonial } from "@/components/sections/cards";
import { homeProvisional as home } from "@/content/home.provisional";
import { getHomeContent } from "@/lib/wordpress/home";
import styles from "./page.module.css";

export default async function Home() {
  const content = await getHomeContent();
  const metrics = content.caseStudy.metrics.length >= 3 ? content.caseStudy.metrics.slice(0, 3) : home.metrics;
  const cta = content.settings.globalCta.label ? content.settings.globalCta : home.globalCta;
  return <><Header currentPath="/"/><main><Container>
    <section className={styles.hero}><div><p className={styles.eyebrow}>{home.hero.eyebrow}</p><h1>{home.hero.title}</h1><p>{home.hero.copy}</p><Button href={cta.url}>{cta.label}</Button><Button href="/servicios" variant="secondary">Explorar servicios</Button></div><div className={styles.modules}>{content.services.map((item,index)=><Link key={item.id} href={`/servicios/${item.slug}`}><article><span>{item.visualIdentifier || `0${index+1}`}</span><strong>{item.name}</strong><ProvisionalBadge/></article></Link>)}</div></section>
    <section className={styles.trust}><ProvisionalBadge/><p>Logotipos provisionales — cliente</p><div className={styles.grid}>{metrics.map((metric,index)=><Metric key={`${metric.label}-${index}`} metric={metric}/>)}</div></section>
    <section id="servicios"><EditorialBlock/><div className={styles.grid}>{content.services.map((service)=><ServiceCard key={service.id} service={service}/>)}</div><Button href="#contacto">Encontrar mi solución</Button></section>
    <section id="casos" className={styles.grid}><Link href={`/casos-de-exito/${content.caseStudy.slug}`}><CaseStudyCard caseStudy={content.caseStudy}/></Link><article className={styles.caseDetails}><p className={styles.eyebrow}>Caso destacado</p><h2>{content.caseStudy.clientName}</h2><p><strong>Problema:</strong> {content.caseStudy.challenge}</p><p><strong>Solución:</strong> {content.caseStudy.solution}</p>{content.caseStudy.metrics.map((metric,index)=><Metric key={`${metric.label}-${index}`} metric={metric}/>)}</article><Testimonial testimonial={content.testimonials[0]}/></section>
    <section id="proceso"><p className={styles.eyebrow}>Proceso</p><ol className={styles.process}>{home.process.map((item,index)=><li key={item}>0{index+1} {item}</li>)}</ol></section>
    <section><p className={styles.eyebrow}>Testimonios</p><div className={styles.grid}>{content.testimonials.map((testimonial)=><Testimonial key={testimonial.id} testimonial={testimonial}/>)}</div></section>
    <section id="recursos"><p className={styles.eyebrow}>Recursos</p><div className={styles.grid}>{content.resources.map((resource)=><ResourceCard key={resource.id} resource={resource}/>)}</div><Button href="#recursos" variant="secondary">Explorar recursos</Button></section>
    <CtaSection label={cta.label} url={cta.url} contact={content.settings.contact.publicEmail}/>
  </Container></main><Footer/></>;
}
