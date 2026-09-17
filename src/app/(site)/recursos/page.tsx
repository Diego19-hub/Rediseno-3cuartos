import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { CtaSection, ResourceCard } from "@/components/sections/cards";
import { getResourcesContent, resourcesProvisional } from "@/lib/wordpress/resources";
import styles from "./page.module.css";

export const metadata = { title: "Recursos | 3cuartos", description: "Recursos prácticos de estrategia, creatividad y tecnología." };

export default async function ResourcesPage() {
  const content = await getResourcesContent();
  const [featured, ...remaining] = content.resources;
  const cta = content.settings.globalCta.label ? content.settings.globalCta : { label: "Cuéntanos tu proyecto", url: "/#contacto" };
  return <><Header currentPath="/recursos"/><main><Container>
    <section className={styles.hero}><div><p className={styles.eyebrow}>{resourcesProvisional.hero.eyebrow}</p><h1>{resourcesProvisional.hero.title}</h1><p>{resourcesProvisional.hero.copy}</p></div><article className={styles.feature}><ProvisionalBadge/><p>{content.source === "wordpress" ? "Recursos administrados desde WordPress local." : "Contenido provisional de respaldo."}</p></article></section>
    {content.categories.length > 0 && <section className={styles.section}><p className={styles.eyebrow}>Categorías</p><ul className={styles.categories}>{content.categories.map((category) => <li className={styles.category} key={category.id}>{category.name}</li>)}</ul></section>}
    {featured ? <><section className={styles.section}><p className={styles.eyebrow}>Recurso destacado</p><Link href={`/recursos/${featured.slug}`} className={styles.feature}><h2>{featured.title}</h2><p>{featured.featuredExcerpt || featured.excerpt}</p><ProvisionalBadge/></Link></section><section className={styles.section}><p className={styles.eyebrow}>Más recursos</p><div className={styles.grid}>{remaining.map((resource) => <Link key={resource.id} href={`/recursos/${resource.slug}`}><ResourceCard resource={resource}/></Link>)}</div></section></> : <section className={styles.section}><div className={styles.empty}><h2>Aún no hay recursos publicados.</h2><p>Cuando existan publicaciones disponibles en WordPress, aparecerán aquí.</p></div></section>}
    <CtaSection label={cta.label} url={cta.url} contact={content.settings.contact.publicEmail}/>
  </Container></main><Footer/></>;
}
