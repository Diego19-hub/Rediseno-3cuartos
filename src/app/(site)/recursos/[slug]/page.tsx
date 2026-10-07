/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { CtaSection, ResourceCard } from "@/components/sections/cards";
import { getResourcePageContent, getResourcesContent } from "@/lib/wordpress/resources";
import styles from "../page.module.css";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type Props = { params: Promise<{ slug: string }> };
const formatDate = (value: string) => value ? new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date(value)) : undefined;

export async function generateStaticParams() { return (await getResourcesContent()).resources.map((resource) => ({ slug: resource.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const content = await getResourcePageContent((await params).slug); return content ? { title: `${content.resource.title} | 3cuartos`, description: content.resource.featuredExcerpt || content.resource.excerpt } : { title: "Recurso no encontrado | 3cuartos", robots: { index: false } }; }

export default async function ResourcePage({ params }: Props) {
  const content = await getResourcePageContent((await params).slug);
  if (!content) notFound();
  const { resource, related } = content;
  const cta = content.settings.globalCta.label ? content.settings.globalCta : { label: "Cuéntanos tu proyecto", url: "/#contacto" };
  return <><main><Container>
    <section className={`${styles.section} ${styles.breadcrumb}`}><Breadcrumb current={resource.title} sectionLabel="Recursos" sectionHref="/recursos"/></section>
    <ScrollReveal><article className={styles.article}>{resource.categories.length ? <ul className={styles.categories}>{resource.categories.map((category) => <li className={styles.category} key={category.id}>{category.name}</li>)}</ul> : null}{formatDate(resource.publishedAt) ? <p>{formatDate(resource.publishedAt)}</p> : null}<h1>{resource.title}</h1>{resource.featuredExcerpt || resource.excerpt ? <p className={styles.copy}>{resource.featuredExcerpt || resource.excerpt}</p> : null}{resource.image?.url ? <img src={resource.image.url} alt={resource.image.alt || resource.title} width={resource.image.width || 1200} height={resource.image.height || 800} /> : null}{resource.content ? <p>{resource.content}</p> : null}</article></ScrollReveal>
    {related.length > 0 && <section className={styles.section}><p className={styles.eyebrow}>Recursos relacionados</p><div className={styles.grid}>{related.map((item) => <Link href={`/recursos/${item.slug}`} key={item.id}><ResourceCard resource={item}/></Link>)}</div></section>}
    <CtaSection label={cta.label} url={cta.url}/>
  </Container></main><Footer/></>;
}
