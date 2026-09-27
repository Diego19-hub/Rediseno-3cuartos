"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./final-cta.module.css";

type FinalCtaProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  compact?: boolean;
};

export function FinalCta({
  eyebrow,
  title = "El siguiente proyecto puede empezar aquí.",
  description = "Cuéntanos qué quieres construir, mejorar o transformar. Empecemos por entenderlo.",
  ctaLabel = "Cuéntanos tu proyecto",
  ctaUrl = "/contacto",
  compact = false,
}: FinalCtaProps) {
  const reducedMotion = useReducedMotion();
  const lineInitial = reducedMotion ? false : { opacity: 0.28, x: 0 };
  const lineVisible = { opacity: 1, x: 0 };

  return (
    <section data-header-theme="dark" id="contacto" className={`${styles.section} ${compact ? styles.compact : ""}`} aria-labelledby="final-cta-title">
      {!compact && <div className={styles.transition} aria-hidden="true" />}
      <div className={styles.inner}>
        <motion.div
          className={styles.copy}
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h2 id="final-cta-title">{title}</h2>
          <p className={styles.description}>{description}</p>
          <Link className={styles.action} href={ctaUrl}>{ctaLabel} <span aria-hidden="true">→</span></Link>
        </motion.div>

        {!compact && <motion.div
          className={styles.disciplines}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.12 }}
        >
          ESTRATEGIA <span>—</span> CREATIVIDAD <span>—</span> TECNOLOGÍA
        </motion.div>}

        {!compact && <svg className={styles.systemLine} viewBox="0 0 900 72" preserveAspectRatio="none" aria-hidden="true">
          <motion.path
            d="M0 36H270"
            initial={lineInitial}
            whileInView={lineVisible}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: reducedMotion ? 0 : 0.55, ease: "easeOut" }}
          />
          <motion.path
            d="M270 36H560"
            initial={reducedMotion ? false : { opacity: 0.28, x: 48 }}
            whileInView={lineVisible}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : 0.14, ease: "easeOut" }}
          />
          <motion.path
            d="M560 36H900"
            initial={reducedMotion ? false : { opacity: 0.28, x: 96 }}
            whileInView={lineVisible}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : 0.28, ease: "easeOut" }}
          />
        </svg>}
      </div>
    </section>
  );
}
