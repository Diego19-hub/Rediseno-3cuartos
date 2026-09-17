import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/ui/feedback-message";
import { FormField } from "@/components/ui/form-field";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { Container } from "@/components/ui/container";
import { CaseStudyCard, CtaSection, EditorialBlock, Metric, ResourceCard, ServiceCard, Testimonial } from "@/components/sections/cards";
import styles from "./page.module.css";
export const metadata: Metadata={title:"Sistema de diseño",robots:{index:false,follow:false}};
export default function DesignSystem(){return <><Header/><main><Container><header className={styles.intro}><p>Ruta interna — no indexable</p><h1>Sistema UI modular</h1><ProvisionalBadge/></header><section className={styles.showcase}><h2>Tipografía y acciones</h2><p className={styles.display}>Todo conecta.</p><div className={styles.row}><Button>Primario</Button><Button disabled>Deshabilitado</Button><Button variant="secondary">Secundario</Button></div></section><section className={styles.showcase}><h2>Campos y mensajes</h2><div className={styles.form}><FormField error="Mensaje de error de ejemplo." id="email" label="Correo" type="email"/><FeedbackMessage>Estado exitoso anunciable.</FeedbackMessage><FeedbackMessage type="error">Error anunciable.</FeedbackMessage></div></section><section className={styles.showcase}><h2>Tarjetas</h2><div className={styles.grid}><ServiceCard/><CaseStudyCard/><ResourceCard/><Metric/><Testimonial/></div></section><EditorialBlock/><CtaSection/></Container></main><Footer/></>}
