import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/sections/contact-form";
import { getHomeContent } from "@/lib/wordpress/home";
import styles from "./page.module.css";
export const metadata: Metadata = { title: "Contacto", description: "Cuéntanos tu proyecto y exploremos el siguiente paso." };
export default async function ContactPage() {
  const content = await getHomeContent();
  const phone = content.sources.settings === "wordpress" ? content.settings.contact.phone.trim() : "";
  const whatsappUrl = content.sources.settings === "wordpress" ? content.settings.whatsappUrl.trim() : "";
  const phoneHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : "";
  const hasDirectContact = Boolean(phone || whatsappUrl);

  return <>
    <main className={styles.main}>
      <div className={styles.contactLayout}>
        <section data-header-theme="light" className={styles.intro} aria-labelledby="contact-title">
          <p className={styles.eyebrow}>CONTACTO / 3CUARTOS</p>
          <h1 id="contact-title">Cuéntanos qué quieres construir.</h1>
          <p className={styles.introText}>No necesitas llegar con todas las respuestas. Cuéntanos dónde estás y qué quieres conseguir; nosotros empezamos por entenderlo.</p>
          <p className={styles.closing}>ESTRATEGIA <span aria-hidden="true">·</span> CREATIVIDAD <span aria-hidden="true">·</span> TECNOLOGÍA</p>
        </section>
        <div className={styles.archLine} aria-hidden="true" />
        <section data-header-theme="light" className={styles.formPanel} aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className={styles.srOnly}>Formulario de contacto</h2>
          <ContactForm />
          {hasDirectContact ? <aside className={styles.direct} aria-labelledby="direct-contact-title">
            <h2 id="direct-contact-title">¿PREFIERES HABLAR DIRECTAMENTE?</h2>
            <div className={styles.directLinks}>
              {phone ? <a href={phoneHref}><span>TELÉFONO</span><strong>{phone} <i aria-hidden="true">→</i></strong></a> : null}
              {whatsappUrl ? <a href={whatsappUrl}><span>WHATSAPP</span><strong>Escríbenos <i aria-hidden="true">→</i></strong></a> : null}
            </div>
          </aside> : null}
        </section>
      </div>
    </main>
    <Footer />
  </>;
}
