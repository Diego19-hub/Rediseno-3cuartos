"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./confidence-section.module.css";

export type ConfidenceBrand = {
  name: string;
  logo?: string;
  approved?: boolean;
};

export type ConfidenceTestimonial = {
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
  logo?: string;
  approved?: boolean;
};

type ConfidenceSectionProps = {
  brands?: readonly ConfidenceBrand[];
  testimonial?: ConfidenceTestimonial | null;
  preview?: boolean;
};

function ConfidenceContent({
  brands,
  testimonial,
  demo,
}: {
  brands: readonly ConfidenceBrand[];
  testimonial: ConfidenceTestimonial;
  demo: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const railX = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -20]);

  return (
    <section data-header-theme="light" ref={sectionRef} id="confianza" className={styles.section} aria-labelledby="confidence-title">
      <div className={styles.transitionLine} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>06 / CONFIANZA</p>
          <h2 id="confidence-title">La confianza se construye en equipo.</h2>
        </div>

        <div className={styles.brandRail} aria-label="Marcas participantes">
          <motion.div className={styles.brandTrack} style={reduced ? undefined : { x: railX }}>
            {brands.map((brand) => (
              <div className={styles.brand} key={brand.name}>
                {brand.logo ? <Image src={brand.logo} alt={brand.name} width={160} height={48} /> : <span>{brand.name}</span>}
              </div>
            ))}
          </motion.div>
        </div>

        <div className={styles.testimonialArea}>
          <p className={styles.testimonialEyebrow}>Una relación que sigue tomando forma.</p>
          <blockquote>
            <p>“{testimonial.quote}”</p>
            {(testimonial.author || testimonial.role || testimonial.company) && (
              <footer>
                {testimonial.author && <cite>{testimonial.author}</cite>}
                {testimonial.role && <span>{testimonial.role}</span>}
                {testimonial.company && <span>{testimonial.company}</span>}
              </footer>
            )}
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export function ConfidenceSection({ brands = [], testimonial = null, preview = false }: ConfidenceSectionProps) {
  const demoBrands: readonly ConfidenceBrand[] = [
    { name: "Answare IT", logo: "/images/brand/answareit-display.png", approved: true },
    { name: "Calforce", approved: true },
    { name: "ReciclaGil", logo: "/images/brand/reciclagil-display.png", approved: true },
    { name: "Senderos del Roble", logo: "/images/brand/senderos-del-roble-display.png", approved: true },
  ];
  const demoTestimonial: ConfidenceTestimonial = {
    quote: "Texto de muestra para revisar la composición editorial.",
    author: "Persona de muestra",
    role: "Rol de muestra",
    company: "Organización de muestra",
    approved: true,
  };
  const usingDemo = preview && brands.length === 0 && !testimonial;
  const sourceBrands = usingDemo ? demoBrands : brands;
  const sourceTestimonial = usingDemo ? demoTestimonial : testimonial;
  const approvedBrands = sourceBrands.filter((brand) => (usingDemo || brand.approved) && brand.name.trim());
  const approvedTestimonial = sourceTestimonial?.approved && sourceTestimonial.quote?.trim() ? sourceTestimonial : null;

  // Keep the chapter unpublished until both relationships and testimonial copy are validated.
  if (approvedBrands.length === 0 || !approvedTestimonial) return null;

  return <ConfidenceContent brands={approvedBrands} testimonial={approvedTestimonial} demo={usingDemo} />;
}
