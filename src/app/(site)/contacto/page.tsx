import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CtaSection } from "@/components/sections/cards";
import { ContactForm } from "@/components/sections/contact-form";
import { getGlobalSettings } from "@/lib/wordpress/queries";
import styles from "./page.module.css";
export const metadata: Metadata = { title: "Contacto", description: "Cuéntanos tu proyecto y exploremos el siguiente paso." };
export default async function ContactPage() {
  const settings = await getGlobalSettings().catch(() => null);
  const contact = settings?.contact;
  return <><Header currentPath="/contacto" /><main className={styles.main}><section className={styles.hero}><p className={styles.eyebrow}>Hablemos</p><h1>Cuéntanos tu proyecto</h1><p>Comparte el contexto que tengas y te responderemos con un siguiente paso claro.</p><span className={styles.provisional}>Tiempo de respuesta provisional — cliente</span></section><section className={styles.content}><ContactForm /><aside className={styles.alternatives}><h2>También puedes escribirnos</h2>{contact?.publicEmail && <a href={`mailto:${contact.publicEmail}`}>{contact.publicEmail}</a>}{contact?.phone && <a href={`tel:${contact.phone}`}>{contact.phone}</a>}{settings?.whatsappUrl && <a href={settings.whatsappUrl}>WhatsApp</a>}{settings?.bookingUrl && <a href={settings.bookingUrl}>Agendar una conversación</a>}<h2>¿Qué sucede después?</h2><p>Revisamos tu mensaje, aclaramos objetivos y proponemos una conversación inicial. Contenido provisional — cliente.</p></aside></section><CtaSection url="/contacto" /></main><Footer /></>;
}
