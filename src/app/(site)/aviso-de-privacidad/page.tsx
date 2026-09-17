import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { Container } from "@/components/ui/container";
import { CtaSection } from "@/components/sections/cards";
import { getPageBySlug, getGlobalSettings } from "@/lib/wordpress/queries";
import styles from "./page.module.css";
const fallback = { title: "Aviso de privacidad", content: "Este aviso de privacidad es provisional y está pendiente de revisión y aprobación del cliente. No constituye un documento legal definitivo.", modifiedAt: "" };
export const metadata: Metadata = { title: "Aviso de privacidad", description: "Aviso de privacidad provisional pendiente de revisión del cliente." };
export default async function PrivacyPage() { const [page, settings] = await Promise.all([getPageBySlug("aviso-de-privacidad"), getGlobalSettings().catch(() => null)]); const content = page ?? fallback; const date = content.modifiedAt ? new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date(content.modifiedAt)) : "Pendiente de confirmación"; return <><Header /><main><Container><section className={styles.header}><Breadcrumb current={content.title} sectionLabel="Legal" sectionHref="/aviso-de-privacidad"/><p className={styles.eyebrow}>Información legal</p><h1>{content.title}</h1><ProvisionalBadge/><p>Última actualización: {date}</p></section><article className={styles.article}>{content.content.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}{settings?.contact?.publicEmail && <p>Para consultas, puedes escribir a <a href={`mailto:${settings.contact.publicEmail}`}>{settings.contact.publicEmail}</a>.</p>}</article><CtaSection url="/contacto" /></Container></main><Footer/></>; }
