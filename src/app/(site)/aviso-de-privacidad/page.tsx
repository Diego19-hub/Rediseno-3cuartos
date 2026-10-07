import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { CtaSection } from "@/components/sections/cards";
import { getPageBySlug } from "@/lib/wordpress/queries";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("aviso-de-privacidad");
  return page
    ? { title: page.title, description: page.excerpt || undefined }
    : { title: "Aviso de privacidad | 3cuartos", robots: { index: false, follow: false } };
}

export default async function PrivacyPage() {
  const page = await getPageBySlug("aviso-de-privacidad");
  if (!page) notFound();
  const date = page.modifiedAt ? new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date(page.modifiedAt)) : undefined;
  return <><main><Container><ScrollReveal><section className={styles.header}><Breadcrumb current={page.title} sectionLabel="Legal" sectionHref="/aviso-de-privacidad"/><p className={styles.eyebrow}>Información legal</p><h1>{page.title}</h1>{date ? <p>Última actualización: {date}</p> : null}</section><article className={styles.article}>{page.content.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</article></ScrollReveal><CtaSection url="/contacto" /></Container></main><Footer/></>;
}
