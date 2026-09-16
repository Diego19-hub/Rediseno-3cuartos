import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import styles from "./page.module.css";

const capabilities = ["Branding", "Desarrollo web", "Marketing digital"];

export default function HomePage() {
  return (
    <main>
      <Section aria-labelledby="home-title">
        <div className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>3cuartos</p>
            <h1 id="home-title">Todo conecta.</h1>
            <p className={styles.copy}>Un ecosistema de branding, desarrollo web y marketing digital.</p>
            <Button href="#proximamente">Cuéntanos tu proyecto</Button>
          </div>
          <div aria-label="Capacidades conectadas" className={styles.modules}>
            {capabilities.map((capability, index) => (
              <article className={styles.module} key={capability}>
                <span>0{index + 1}</span>
                <strong>{capability}</strong>
                <small>Contenido provisional — cliente</small>
              </article>
            ))}
          </div>
        </div>
      </Section>
      <Section id="proximamente" aria-labelledby="proximamente-title">
        <p className={styles.eyebrow}>Base técnica</p>
        <h2 id="proximamente-title">Sistema modular en preparación.</h2>
        <p className={styles.copy}>Esta página es una base provisional. Los textos, casos y medios finales serán administrados desde WordPress.</p>
      </Section>
    </main>
  );
}
