import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import type { CaseStudy, Metric as MetricData, Resource, Service, Testimonial as TestimonialData } from "@/types/wordpress";
import styles from "./sections.module.css";
export function ServiceCard({service}:{service?:Service}){return <article className={styles.card}><Chip>Servicio</Chip><h3>{service?.name ?? "Desarrollo web"}</h3><p>{service?.summary ?? "Contenido provisional — cliente."}</p>{service?.isProvisional !== false&&<ProvisionalBadge/>}</article>}
export function CaseStudyCard({caseStudy}:{caseStudy?:CaseStudy}){return <article className={styles.card}><MediaPlaceholder/><Chip>Caso de éxito</Chip><h3>{caseStudy?.title ?? "Sistema conectado"}</h3><p>{caseStudy?.solution ?? "Contenido provisional — cliente."}</p>{caseStudy?.isProvisional !== false&&<ProvisionalBadge/>}</article>}
export function ResourceCard({resource}:{resource?:Resource}){return <article className={styles.card}><Chip>Recurso</Chip><h3>{resource?.title ?? "Perspectiva provisional"}</h3><p>{resource?.featuredExcerpt || resource?.excerpt || "Tiempo de lectura provisional."}</p><ProvisionalBadge/></article>}
export function Metric({metric}:{metric?:MetricData}){return <article className={styles.metric}><strong>{metric?.value ?? "00%"}</strong><span>{metric?.label ?? "Métrica provisional"}</span><ProvisionalBadge/></article>}
export function Testimonial({testimonial}:{testimonial?:TestimonialData}){return <figure className={styles.card}><blockquote>“{testimonial?.quote ?? "Testimonio provisional — cliente."}”</blockquote><figcaption>{testimonial ? `${testimonial.personName} · ${testimonial.jobTitle}` : "Nombre y cargo provisional"}</figcaption>{testimonial?.isProvisional !== false&&<ProvisionalBadge/>}</figure>}
export function EditorialBlock(){return <section className={styles.editorial}><p className={styles.eyebrow}>Editorial</p><h2>Una composición modular con jerarquía clara.</h2><p>Contenido provisional que será reemplazado desde WordPress.</p></section>}
export function CtaSection({label="Cuéntanos tu proyecto",url="#contacto",contact=""}:{label?:string;url?:string;contact?:string}){return <section id="contacto" className={styles.cta}><div><p className={styles.eyebrow}>Proyecto</p><h2>Conversemos.</h2>{contact&&<p>{contact}</p>}<ProvisionalBadge/></div><Button href={url}>{label}</Button></section>}
