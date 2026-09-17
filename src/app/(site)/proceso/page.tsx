import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { CtaSection } from "@/components/sections/cards";
import { aboutProcessProvisional } from "@/content/about-process.provisional";
import styles from "../about-process.module.css";

export const metadata = { title: "Proceso | 3cuartos", description: "El proceso de trabajo conectado de 3cuartos." };

export default function ProcessPage() {
  const process = aboutProcessProvisional.process;
  return <><Header currentPath="/proceso"/><main><Container>
    <section className={styles.hero}><div><p className={styles.eyebrow}>{process.eyebrow}</p><h1>{process.title}</h1><p>{process.intro}</p><ProvisionalBadge/><Button href="/#contacto">Iniciar diagnóstico</Button></div><article className={styles.feature}><p className={styles.eyebrow}>Servicios conectados</p><p>Branding, Desarrollo Web y Marketing Digital participan cuando aportan valor al momento correcto del proceso.</p></article></section>
    <section className={styles.section}><p className={styles.eyebrow}>Etapas</p><ol className={styles.process}>{process.stages.map((stage, index) => <li className={styles.stage} key={stage.title}><span className={styles.stageNumber}>0{index + 1}</span><div><h2>{stage.title}</h2><p className={styles.copy}>{stage.detail}</p><div className={styles.responsibilities}><article className={styles.card}><h3>Entregables orientativos</h3><p>{stage.deliverables}</p></article><article className={styles.card}><h3>3cuartos</h3><p>{stage.team}</p></article><article className={styles.card}><h3>Participación del cliente</h3><p>{stage.client}</p></article></div></div></li>)}</ol></section>
    <CtaSection label="Iniciar diagnóstico" url="/#contacto"/>
  </Container></main><Footer/></>;
}
