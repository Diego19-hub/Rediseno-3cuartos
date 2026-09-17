import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { CtaSection, ResourceCard } from "@/components/sections/cards";
import { getResourcePageContent, getResourcesContent } from "@/lib/wordpress/resources";
import styles from "../page.module.css";

type Props = { params: Promise<{ slug: string }> };
const formatDate = (value: string) => value ? new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date(value)) : "Fecha provisional";

export async function generateStaticParams() { return (await getResourcesContent()).resources.map((resource) => ({ slug: resource.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const content = await getResourcePageContent((await params).slug); return content ? { title: `${content.resource.title} | 3cuartos`, description: content.resource.featuredExcerpt || content.resource.excerpt } : { title: "Recurso no encontrado | 3cuartos", robots: { index: false } }; }

export default async function ResourcePage({ params }: Props) {
  const content = await getResourcePageContent((await params).slug);
  if (!content) notFound();
  const { resource, related } = content;
  const cta = content.settings.globalCta.label ? content.settings.globalCta : { label: "Cuéntanos tu proyecto", url: "/#contacto" };
  return <><Header currentPath="/recursos"/><main><Container>
    <section className={`${styles.section} ${styles.breadcrumb}`}><Breadcrumb current={resource.title} sectionLabel="Recursos" sectionHref="/recursos"/></section>
    <article className={styles.article}><ul className={styles.categories}>{resource.categories.map((category) => <li className={styles.category} key={category.id}>{category.name}</li>)}</ul><p>{formatDate(resource.publishedAt)}</p><h1>{resource.title}</h1><p className={styles.copy}>{resource.featuredExcerpt || resource.excerpt}</p><ProvisionalBadge/><MediaPlaceholder/><p>{resource.content}</p></article>
    {related.length > 0 && <section className={styles.section}><p className={styles.eyebrow}>Recursos relacionados</p><div className={styles.grid}>{related.map((item) => <Link href={`/recursos/${item.slug}`} key={item.id}><ResourceCard resource={item}/></Link>)}</div></section>}
    <CtaSection label={cta.label} url={cta.url}/>
  </Container></main><Footer/></>;
}
