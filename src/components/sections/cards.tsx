import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import styles from "./sections.module.css";
export function ServiceCard(){return <article className={styles.card}><Chip>Servicio</Chip><h3>Desarrollo web</h3><p>Contenido provisional — cliente.</p><ProvisionalBadge/></article>}
export function CaseStudyCard(){return <article className={styles.card}><MediaPlaceholder/><Chip>Caso de éxito</Chip><h3>Sistema conectado</h3><ProvisionalBadge/></article>}
export function ResourceCard(){return <article className={styles.card}><Chip>Recurso</Chip><h3>Perspectiva provisional</h3><p>Tiempo de lectura provisional.</p></article>}
export function Metric(){return <article className={styles.metric}><strong>00%</strong><span>Métrica provisional</span><ProvisionalBadge/></article>}
export function Testimonial(){return <figure className={styles.card}><blockquote>“Testimonio provisional — cliente.”</blockquote><figcaption>Nombre y cargo provisional</figcaption><ProvisionalBadge/></figure>}
export function EditorialBlock(){return <section className={styles.editorial}><p className={styles.eyebrow}>Editorial</p><h2>Una composición modular con jerarquía clara.</h2><p>Contenido provisional que será reemplazado desde WordPress.</p></section>}
export function CtaSection(){return <section className={styles.cta}><div><p className={styles.eyebrow}>Proyecto</p><h2>Conversemos.</h2></div><Button href="#contacto">Cuéntanos tu proyecto</Button></section>}
