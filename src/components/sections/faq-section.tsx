"use client";

import { useState } from "react";
import styles from "./faq-section.module.css";

const questions = [
  {
    question: "¿Qué tipo de proyectos realiza 3Cuartos?",
    answer: "Trabajamos conectando estrategia, creatividad y tecnología para construir experiencias que funcionan como un solo sistema.",
  },
  {
    question: "¿Cómo comienza un proyecto?",
    answer: "El punto de partida es entender dónde estás: trabajamos junto a tu equipo para entender sus metas y plantear un plan personalizado.",
  },
  {
    question: "¿Las soluciones se adaptan a cada negocio?",
    answer: "Planteamos un plan personalizado a partir de las metas y el contexto que entendemos junto a tu equipo.",
  },
  // Cost, timing and post-delivery support remain unpublished until validated with the client.
] as const;

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section data-header-theme="light" id="preguntas-frecuentes" className={styles.section} aria-labelledby="faq-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>08 / PREGUNTAS FRECUENTES</p>
          <h2 id="faq-title">Lo esencial antes de empezar.</h2>
        </div>
        <div className={styles.list}>
          {questions.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index + 1}`;
            return (
              <div className={`${styles.item} ${isOpen ? styles.open : ""}`} key={item.question}>
                <button
                  className={styles.trigger}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{item.question}</span>
                  <span className={styles.plus} aria-hidden="true">+</span>
                </button>
                <div id={answerId} className={styles.answer} role="region" aria-labelledby={`${answerId}-label`} hidden={!isOpen}>
                  <p id={`${answerId}-label`}>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
