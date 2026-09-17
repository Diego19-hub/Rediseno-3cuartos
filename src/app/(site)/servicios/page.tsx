import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { CaseStudyCard, CtaSection, ServiceCard } from "@/components/sections/cards";
import { servicesProvisional } from "@/content/services.provisional";
import { getServicesPageContent } from "@/lib/wordpress/services";
import styles from "./page.module.css";

export const metadata = { title: "Servicios | 3cuartos", description: "Servicios conectados de branding, desarrollo web y marketing digital." };

export default async function ServicesPage() {
  const content = await getServicesPageContent();
  const capabilities = [...new Set(content.services.flatMap((service) => service.capabilities))];
  const cta = content.settings.globalCta.label ? content.settings.globalCta : { label: "Cuéntanos tu proyecto", url: "/#contacto" };
  return <><Header currentPath="/servicios"/><main><Container>
    <section className={styles.hero}><div><p className={styles.eyebrow}>{servicesProvisional.hero.eyebrow}</p><h1>{servicesProvisional.hero.title}</h1><p>{servicesProvisional.hero.copy}</p><Button href={cta.url}>{cta.label}</Button></div><div className={styles.connection}><ProvisionalBadge/><p>{content.source === "wordpress" ? "Servicios administrados desde WordPress local." : "Contenido provisional de respaldo."}</p></div></section>
    <section className={styles.section}><p className={styles.eyebrow}>Servicios</p><div className={styles.grid}>{content.services.map((service) => <Link key={service.id} href={`/servicios/${service.slug}`}><ServiceCard service={service}/></Link>)}</div></section>
    <section className={`${styles.section} ${styles.connection}`}><p className={styles.eyebrow}>Conexión</p><h2>{servicesProvisional.connection.title}</h2><p>{servicesProvisional.connection.copy}</p></section>
    <section className={styles.section}><p className={styles.eyebrow}>Capacidades</p><div className={styles.grid}>{capabilities.map((capability) => <article className={styles.detailCard} key={capability}><h3>{capability}</h3><ProvisionalBadge/></article>)}</div></section>
    <section className={styles.section}><p className={styles.eyebrow}>Proceso</p><ol className={styles.process}>{servicesProvisional.process.map((step, index) => <li key={step}>0{index + 1} {step}</li>)}</ol></section>
    <section className={styles.section}><p className={styles.eyebrow}>Caso destacado</p><div className={styles.grid}><CaseStudyCard caseStudy={content.caseStudy}/></div></section>
    <CtaSection label={cta.label} url={cta.url} contact={content.settings.contact.publicEmail}/>
  </Container></main><Footer/></>;
}
