"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import styles from "./contact-form.module.css";

type FormState = { name: string; company: string; email: string; phone: string; needs: string[]; message: string; consent: boolean };
type FormErrors = Partial<Record<keyof FormState | "submit", string>>;

const initial: FormState = { name: "", company: "", email: "", phone: "", needs: [], message: "", consent: false };
const needOptions = ["Marketing", "Branding", "Desarrollo Web", "No estoy seguro"];

export function ContactForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (submitted) window.scrollTo({ top: 0, behavior: "auto" });
  }, [submitted]);

  const update = (key: "name" | "company" | "email" | "phone" | "message", value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, submit: undefined }));
  };
  const toggleNeed = (need: string) => {
    setForm((current) => ({ ...current, needs: current.needs.includes(need) ? current.needs.filter((item) => item !== need) : [...current.needs, need] }));
    setErrors((current) => ({ ...current, needs: undefined, submit: undefined }));
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (!form.name.trim()) nextErrors.name = "Indica tu nombre.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = "Indica un correo válido.";
    if (form.phone.trim() && !/^[+\d\s().-]{7,40}$/.test(form.phone.trim())) nextErrors.phone = "Revisa el formato del teléfono.";
    if (form.needs.length === 0) nextErrors.needs = "Selecciona al menos una opción.";
    if (!form.message.trim()) nextErrors.message = "Cuéntanos brevemente qué necesitas.";
    if (!form.consent) nextErrors.consent = "Acepta el uso de la información para continuar.";
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) {
      const targetId = first === "needs" ? "contact-needs-marketing" : `contact-${first}`;
      document.getElementById(targetId)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: form.name, company: form.company, email: form.email, phone: form.phone, service: form.needs.join(", "), message: form.message, consent: form.consent, honeypot: "" }),
      });
      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const fields = result && typeof result === "object" && "fields" in result ? (result as { fields?: Record<string, string> }).fields : undefined;
        setErrors({ submit: fields ? Object.values(fields).join(" ") : "No pudimos enviar tu solicitud. Inténtalo nuevamente." });
        return;
      }
      setSubmitted(true);
    } catch {
      setErrors({ submit: "No pudimos conectar con el canal de contacto. Inténtalo nuevamente." });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: "name" | "company" | "email" | "phone", label: string, options?: { required?: boolean; autoComplete?: string; placeholder?: string; type?: string; inputMode?: "tel" }) => (
    <label className={styles.field} htmlFor={`contact-${key}`}>
      <span>{label}{options?.required ? " *" : ""}</span>
      <input id={`contact-${key}`} name={key} type={options?.type ?? "text"} inputMode={options?.inputMode} value={form[key]} required={options?.required} autoComplete={options?.autoComplete} placeholder={options?.placeholder} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `contact-${key}-error` : undefined} onChange={(event) => update(key, event.target.value)} />
      {errors[key] ? <span id={`contact-${key}-error`} className={styles.error}>{errors[key]}</span> : null}
    </label>
  );

  if (submitted) return <section className={styles.success} role="status" aria-live="polite">
    <span className={styles.check} aria-hidden="true">✓</span>
    <h2>RECIBIDO.</h2>
    <p>Gracias por contarnos sobre tu proyecto.</p>
    <p>Revisaremos la información y nos pondremos<br />en contacto contigo.</p>
    <Link href="/">Volver al inicio <span aria-hidden="true">→</span></Link>
  </section>;

  return <form className={styles.form} onSubmit={submit} noValidate aria-busy={submitting}>
    <div className={styles.grid}>
      {field("name", "Nombre", { required: true, autoComplete: "name" })}
      {field("company", "Empresa", { autoComplete: "organization" })}
      {field("email", "Email", { required: true, autoComplete: "email", type: "email" })}
      {field("phone", "Teléfono", { autoComplete: "tel", type: "tel", inputMode: "tel" })}
    </div>
    <fieldset className={styles.needs} aria-describedby={errors.needs ? "contact-needs-error" : undefined}>
      <legend>Qué necesitas *</legend>
      <div className={styles.needsGrid}>{needOptions.map((need) => { const id = `contact-needs-${need.toLowerCase().replace(/\s+/g, "-")}`; return <label className={styles.choice} htmlFor={id} key={need}><input id={id} type="checkbox" name="needs" value={need} checked={form.needs.includes(need)} onChange={() => toggleNeed(need)} /><span>{need}</span></label>; })}</div>
      {errors.needs ? <span id="contact-needs-error" className={styles.error}>{errors.needs}</span> : null}
    </fieldset>
    <label className={styles.choice} htmlFor="contact-consent"><input id="contact-consent" name="consent" value="1" type="checkbox" checked={form.consent} onChange={(event) => { setForm((current) => ({ ...current, consent: event.target.checked })); setErrors((current) => ({ ...current, consent: undefined, submit: undefined })); }} aria-invalid={Boolean(errors.consent)} /><span>Acepto que 3Cuartos use esta información para responder a mi solicitud.</span></label>
    {errors.consent ? <span className={styles.error}>{errors.consent}</span> : null}
    <label className={`${styles.field} ${styles.message}`} htmlFor="contact-message">
      <span>Mensaje *</span>
      <textarea id="contact-message" name="message" rows={5} value={form.message} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} onChange={(event) => update("message", event.target.value)} />
      {errors.message ? <span id="contact-message-error" className={styles.error}>{errors.message}</span> : null}
    </label>
    {errors.submit ? <p className={styles.submitError} role="alert">{errors.submit}</p> : null}
    {submitting ? <p className={styles.submitStatus} role="status" aria-live="polite">Enviando tu solicitud…</p> : null}
    <div className={styles.formActions}><Button type="submit" disabled={submitting}>{submitting ? "ENVIANDO…" : <>ENVIAR PROYECTO <span aria-hidden="true">→</span></>}</Button></div>
  </form>;
}
