import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { CtaSection, ServiceCard, Testimonial } from "@/components/sections/cards";
import { aboutProcessProvisional } from "@/content/about-process.provisional";
import { getAboutContent } from "@/lib/wordpress/about";
import styles from "../about-process.module.css";

export const metadata = { title: "Nosotros | 3cuartos", description: "La práctica y metodología provisional de 3cuartos." };

export default async function AboutPage() {
  const content = await getAboutContent();
  const about = aboutProcessProvisional.about;
  const cta = content.settings.globalCta.label ? content.settings.globalCta : { label: "Cuéntanos tu proyecto", url: "/#contacto" };
  return <><Header currentPath="/nosotros"/><main><Container>
    <section className={styles.hero}><div><p className={styles.eyebrow}>{about.eyebrow}</p><h1>{about.title}</h1><p>{about.intro}</p><ProvisionalBadge/><Button href={cta.url}>{cta.label}</Button></div><article className={styles.feature}><p className={styles.eyebrow}>Cómo ayudamos</p><h2>Convertimos decisiones dispersas en un sistema con dirección.</h2><p>{about.philosophy}</p></article></section>
    <section className={styles.section}><p className={styles.eyebrow}>Filosofía</p><div className={styles.feature}><p>{about.philosophy}</p></div></section>
    <section className={styles.section}><p className={styles.eyebrow}>Equipo</p><div className={styles.grid}>{content.team.map((member) => <article className={styles.card} key={member.id}><MediaPlaceholder/><h3>{member.name}</h3><p>{member.role}</p><p>{member.biography}</p>{member.isProvisional && <ProvisionalBadge/>}</article>)}</div></section>
    <section className={styles.section}><p className={styles.eyebrow}>Capacidades conectadas</p><div className={styles.grid}>{content.services.map((service) => <ServiceCard key={service.id} service={service}/>)}</div></section>
    <section className={styles.section}><p className={styles.eyebrow}>Principios</p><div className={styles.grid}>{about.values.map((value) => <article className={styles.card} key={value}><h3>{value}</h3><ProvisionalBadge/></article>)}</div></section>
    <section className={styles.feature}><p className={styles.eyebrow}>Metodología</p><h2>Un proceso común para especialidades distintas.</h2><p>Conoce cómo conectamos descubrimiento, definición, creación, lanzamiento y mejora.</p><Link href="/proceso">Conocer el proceso</Link></section>
    {content.testimonial && <section className={styles.section}><Testimonial testimonial={content.testimonial}/></section>}
    <CtaSection label={cta.label} url={cta.url} contact={content.settings.contact.publicEmail}/>
  </Container></main><Footer/></>;
}
