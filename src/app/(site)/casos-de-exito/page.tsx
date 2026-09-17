import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { CaseStudyCard, CtaSection, Metric } from "@/components/sections/cards";
import { caseStudiesProvisional, getCaseStudiesContent } from "@/lib/wordpress/case-studies";
import styles from "./page.module.css";

export const metadata = { title: "Casos de éxito | 3cuartos", description: "Casos de estrategia, diseño, desarrollo y marketing conectados." };

export default async function CaseStudiesPage() {
  const content = await getCaseStudiesContent();
  const [featured, ...remaining] = content.cases;
  const cta = content.settings.globalCta.label ? content.settings.globalCta : { label: "Cuéntanos tu proyecto", url: "/#contacto" };
  return <><Header currentPath="/casos-de-exito"/><main><Container>
    <section className={styles.hero}><div><p className={styles.eyebrow}>{caseStudiesProvisional.hero.eyebrow}</p><h1>{caseStudiesProvisional.hero.title}</h1><p>{caseStudiesProvisional.hero.copy}</p><Button href={cta.url}>{cta.label}</Button></div><div className={styles.feature}><ProvisionalBadge/><p>{content.source === "wordpress" ? "Los casos locales se administran desde WordPress y continúan marcados como provisionales." : "Contenido de respaldo provisional."}</p></div></section>
    <section className={styles.section}><p className={styles.eyebrow}>Caso principal</p><Link href={`/casos-de-exito/${featured.slug}`} className={styles.feature}><h2>{featured.title}</h2><p>{featured.solution}</p><ProvisionalBadge/>{content.source === "wordpress" && featured.metrics.map((metric, index) => <Metric key={`${metric.label}-${index}`} metric={metric}/>)}</Link></section>
    <section className={styles.section}><p className={styles.eyebrow}>Más casos</p><div className={styles.grid}>{remaining.map((caseStudy) => <Link key={caseStudy.id} href={`/casos-de-exito/${caseStudy.slug}`}><CaseStudyCard caseStudy={caseStudy}/></Link>)}</div></section>
    <CtaSection label={cta.label} url={cta.url} contact={content.settings.contact.publicEmail}/>
  </Container></main><Footer/></>;
}
