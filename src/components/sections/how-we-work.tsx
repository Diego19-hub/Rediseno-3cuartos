"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./how-we-work.module.css";

const stages = [
  ["01", "Entender", "Conocemos el contexto, el problema y las metas del proyecto."],
  ["02", "Definir", "Ordenamos las prioridades y establecemos una dirección clara."],
  ["03", "Crear", "Convertimos la estrategia en una solución visual y funcional."],
  ["04", "Lanzar", "Ponemos la solución en marcha y comprobamos su funcionamiento."],
  ["05", "Mejorar", "Medimos, aprendemos y optimizamos lo que sigue."],
] as const;

export function HowWeWork() {
  const reduced = useReducedMotion() === true;

  return (
    <section data-header-theme="light" id="como-trabajamos" className={styles.section} aria-labelledby="how-we-work-title">
      <div className={styles.intro}>
        <h2 id="how-we-work-title">Antes de hacer, entendemos.</h2>
        <p className={styles.introCopy}>
          Trabajamos junto a tu equipo para entender tus metas y plantear un plan personalizado.
        </p>
      </div>

      <div className={styles.stage}>
        <div className={styles.connectionLine} aria-hidden="true">
          <svg className={styles.connectionSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className={styles.connectionBasePath} d="M 10 42 C 18 42 22 46 30 46 C 38 46 42 50 50 50 C 58 50 62 54 70 54 C 78 54 84 58 90 58" />
            <motion.path
              className={styles.connectionProgress}
              d="M 10 42 C 18 42 22 46 30 46 C 38 46 42 50 50 50 C 58 50 62 54 70 54 C 78 54 84 58 90 58"
              pathLength={1}
              initial={reduced ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.1, ease: [0.2, 0, 0, 1] }}
            />
          </svg>
          <motion.span
            className={styles.connectionProgressMobile}
            initial={reduced ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.2, 0, 0, 1] }}
          />
        </div>

        {stages.map(([number, title, description]) => (
          <motion.article
            key={number}
            className={styles.stageItem}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.58, ease: [0.2, 0, 0, 1] }}
          >
            <span className={styles.node} aria-hidden="true">
              <motion.span
                className={styles.nodeCore}
                initial={reduced ? false : { scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
            <div className={styles.stageCopy}>
              <span className={styles.stageNumber}>{number}</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </motion.article>
        ))}
      </div>

      <div className={styles.closing}>
        <Link href="/contacto">Agendar una sesión <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
